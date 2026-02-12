from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import requests

router = APIRouter()

class ExecutionRequest(BaseModel):
    language: str
    code: str
    test_cases: Optional[List[Dict[str, str]]] = None

@router.post("/execute")
def execute_code(request: ExecutionRequest):
    """
    Executes code using the Piston API (https://emkc.org/api/v2/piston).
    Acts as a proxy to avoid CORS issues on frontend and centralize logic.
    """
    
    # Map our language names to Piston's runtime names
    runtime_map = {
        "python": {"language": "python", "version": "3.10.0"},
        "java": {"language": "java", "version": "15.0.2"},
        "javascript": {"language": "javascript", "version": "18.15.0"}
    }

    lang_config = runtime_map.get(request.language.lower())
    
    if not lang_config:
        # Fallback or error
        # Piston supports many, let's try direct map if not in our rigorous list
        lang_config = {"language": request.language.lower(), "version": "*"}

    # Helper to run a single execution
    def _run_piston(code_content: str, stdin_content: str = ""):
        # Prepare file object with name if needed
        file_obj = {"content": code_content}
        if lang_config["language"] == "java":
            file_obj["name"] = "Main.java"

        payload = {
            "language": lang_config["language"],
            "version": lang_config["version"],
            "files": [file_obj],
            "stdin": stdin_content
        }
        
        try:
            response = requests.post("https://emkc.org/api/v2/piston/execute", json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Piston API Error: {e}")
            raise HTTPException(status_code=503, detail="Code execution service unavailable")

    try:
        # standard execution (no test cases)
        if not request.test_cases:
            result = _run_piston(request.code)
            run_result = result.get("run", {})
            return {
                "output": run_result.get("output", ""),
                "stdout": run_result.get("stdout", ""),
                "stderr": run_result.get("stderr", ""),
                "exit_code": run_result.get("code")
            }
        
        # Test Case Execution
        test_results = []
        passed_count = 0
        
        for case in request.test_cases:
            input_data = case.get("input", "")
            expected = case.get("expected_output", "").strip()
            
            result = _run_piston(request.code, input_data)
            run_result = result.get("run", {})
            actual_raw = run_result.get("stdout", "")
            actual = actual_raw.strip()
            
            # Simple exact match for now (could be improved with fuzzy match)
            # Normalize newlines
            passed = (actual.replace("\r\n", "\n") == expected.replace("\r\n", "\n"))
            if passed:
                passed_count += 1
                
            test_results.append({
                "input": input_data,
                "expected_output": expected,
                "actual_output": actual,
                "passed": passed,
                "stderr": run_result.get("stderr", "")
            })
            
        return {
            "test_results": test_results,
            "passed_count": passed_count,
            "total_count": len(request.test_cases),
            "is_test_run": True
        }

    except Exception as e:
        print(f"Internal Execution Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
