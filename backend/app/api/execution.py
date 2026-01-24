from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter()

class ExecutionRequest(BaseModel):
    language: str
    code: str

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

    # Prepare file object with name if needed
    file_obj = {"content": request.code}
    if lang_config["language"] == "java":
        file_obj["name"] = "Main.java"

    payload = {
        "language": lang_config["language"],
        "version": lang_config["version"],
        "files": [file_obj]
    }

    try:
        response = requests.post("https://emkc.org/api/v2/piston/execute", json=payload)
        response.raise_for_status()
        result = response.json()
        
        # Piston return format: { run: { stdout: "", stderr: "", output: "", code: 0, signal: null } }
        run_result = result.get("run", {})
        
        return {
            "output": run_result.get("output", ""),
            "stdout": run_result.get("stdout", ""),
            "stderr": run_result.get("stderr", ""),
            "exit_code": run_result.get("code")
        }

    except requests.exceptions.RequestException as e:
        print(f"Execution API Error: {e}")
        raise HTTPException(status_code=503, detail="Code execution service unavailable")
    except Exception as e:
        print(f"Internal Execution Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
