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

@router.get("/leaderboard")
async def get_leaderboard():
    from app.crud.user import user
    # Fetch all users (Inefficient for large DBs, but fine for demo)
    # CRUDBase might not have get_all, let's check or use firestore direct if needed.
    # Assuming user.get_multi() or similar exists, or we just access the collection.
    
    # Using firestore direct for query
    from app.db.firestore import get_db
    db = get_db()
    users_ref = db.collection("users")
    # Sort by ELO descending, limit 10
    query = users_ref.order_by("elo", direction="DESCENDING").limit(10)
    docs = query.stream()
    
    leaderboard = []
    rank = 1
    for doc in docs:
        u = doc.to_dict()
        leaderboard.append({
            "rank": rank,
            "user": u.get("name", "Unknown"),
            "elo": u.get("elo", 1200),
            "change": "+0" # Mock change for now
        })
        rank += 1
        
    return leaderboard

@router.get("/profile")
async def get_competitive_profile(current_user: UserBase = Depends(get_current_user)):
    # Return competitive stats for the logged-in user
    return {
        "rank": 0, # TBD: Calculate rank dynamically if needed
        "elo": current_user.elo,
        "league": "Silver II" if current_user.elo < 1500 else "Gold I", # Simple logic
        "wins": current_user.wins,
        "streak": current_user.streak_count # Reuse main streak
    }
