from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import subprocess
import tempfile
import os
import sys

router = APIRouter()

# Execution timeout in seconds
EXECUTION_TIMEOUT = 10

class ExecutionRequest(BaseModel):
    language: str
    code: str
    test_cases: Optional[List[Dict[str, str]]] = None


def _run_local(language: str, code: str, stdin_content: str = "") -> dict:
    """
    Executes code locally using subprocess with a temp file.
    Returns a dict with stdout, stderr, exit_code.
    """
    lang = language.lower()

    try:
        if lang == "python":
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".py", delete=False, encoding="utf-8"
            ) as f:
                f.write(code)
                tmp_path = f.name
            try:
                result = subprocess.run(
                    [sys.executable, tmp_path],
                    input=stdin_content,
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT,
                )
            finally:
                os.unlink(tmp_path)

        elif lang == "javascript":
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".js", delete=False, encoding="utf-8"
            ) as f:
                f.write(code)
                tmp_path = f.name
            try:
                result = subprocess.run(
                    ["node", tmp_path],
                    input=stdin_content,
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT,
                )
            finally:
                os.unlink(tmp_path)

        elif lang == "java":
            # Java needs class name match — write to a temp dir
            tmp_dir = tempfile.mkdtemp()
            java_file = os.path.join(tmp_dir, "Main.java")
            try:
                with open(java_file, "w", encoding="utf-8") as f:
                    f.write(code)
                # Compile
                compile_result = subprocess.run(
                    ["javac", java_file],
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT,
                )
                if compile_result.returncode != 0:
                    return {
                        "stdout": "",
                        "stderr": compile_result.stderr,
                        "exit_code": compile_result.returncode,
                    }
                # Run
                result = subprocess.run(
                    ["java", "-cp", tmp_dir, "Main"],
                    input=stdin_content,
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT,
                )
            finally:
                import shutil
                shutil.rmtree(tmp_dir, ignore_errors=True)

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Language '{language}' is not supported. Supported: python, javascript, java.",
            )

        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode,
        }

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=408,
            detail=f"Code execution timed out after {EXECUTION_TIMEOUT} seconds.",
        )
    except FileNotFoundError as e:
        # e.g. 'node' or 'java' not installed
        raise HTTPException(
            status_code=503,
            detail=f"Runtime not found on server: {e}. Make sure the required runtime is installed.",
        )


@router.post("/execute")
def execute_code(request: ExecutionRequest):
    """
    Executes code locally using subprocess.
    Supports python, javascript (node), and java.
    """
    try:
        if not request.test_cases:
            # Plain execution
            run = _run_local(request.language, request.code)
            output = run["stdout"] + (("\n" + run["stderr"]) if run["stderr"] else "")
            return {
                "output": output.strip(),
                "stdout": run["stdout"],
                "stderr": run["stderr"],
                "exit_code": run["exit_code"],
            }

        # Test case execution
        test_results = []
        passed_count = 0

        for case in request.test_cases:
            input_data = case.get("input", "")
            expected = case.get("expected_output", "").strip()

            run = _run_local(request.language, request.code, input_data)
            actual = run["stdout"].strip()

            passed = actual.replace("\r\n", "\n") == expected.replace("\r\n", "\n")
            if passed:
                passed_count += 1

            test_results.append(
                {
                    "input": input_data,
                    "expected_output": expected,
                    "actual_output": actual,
                    "passed": passed,
                    "stderr": run["stderr"],
                }
            )

        return {
            "test_results": test_results,
            "passed_count": passed_count,
            "total_count": len(request.test_cases),
            "is_test_run": True,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Internal Execution Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
