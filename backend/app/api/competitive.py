from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.api.auth import get_current_user
from app.models.user import UserBase
from app.data.problems import PROBLEMS_DATA
from app.api.execution import execute_code, ExecutionRequest # Reuse existing logic if possible or call directly

router = APIRouter()

@router.get("/problems")
async def get_problems():
    # Return summary list
    return [
        {
            "id": p["id"],
            "title": p["title"],
            "difficulty": p["difficulty"],
            "tags": [] # Add tags to data later
        }
        for p in PROBLEMS_DATA.values()
    ]

@router.get("/problems/{problem_id}")
async def get_problem_detail(problem_id: str):
    problem = PROBLEMS_DATA.get(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.post("/problems/{problem_id}/submit")
async def submit_solution(problem_id: str, request: ExecutionRequest, current_user: UserBase = Depends(get_current_user)):
    problem = PROBLEMS_DATA.get(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    user_code = request.code
    language = request.language.lower()

    if language == "python":
        # Mock Verification for MVP
        return {
            "status": "Accepted",
            "passed_tests": len(problem["test_cases"]),
            "total_tests": len(problem["test_cases"]),
            "runtime": "45ms"
        }

    if language == "java":
        # Mock Verification for MVP
        # Ideally: Strip user Main class, inject TestRunner Main class, compile & run.
        return {
            "status": "Accepted",
            "passed_tests": len(problem["test_cases"]),
            "total_tests": len(problem["test_cases"]),
            "runtime": "120ms"
        }

    return {"status": "Error", "message": f"Language '{language}' not supported for submission yet."}
