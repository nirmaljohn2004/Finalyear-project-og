from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from app.db.firestore import get_db
from app.api.auth import get_current_user
from app.models.user import UserBase

router = APIRouter()

class PsychometricTestSubmission(BaseModel):
    answers: Dict[str, Any] # Question ID -> Answer

class BehaviorProfile(BaseModel):
    learning_preference: str
    learning_speed: str
    difficulty_comfort: str
    feedback_style: str
    goal_orientation: str

@router.post("/submit", response_model=BehaviorProfile)
async def submit_psychometric_test(submission: PsychometricTestSubmission, current_user: UserBase = Depends(get_current_user)):
    from app.agents.behavior_agent import BehaviorAgent
    agent = BehaviorAgent()
    profile = agent.process(submission.answers)
    print(f"DEBUG PROFILE DATA: {profile}")
    
    db = get_db()
    
    # Save behavior profile
    db.collection("behaviorProfiles").document(current_user.email).set(profile)
    
    return BehaviorProfile(**profile)


@router.get("/me", response_model=BehaviorProfile)
async def get_my_profile(current_user: UserBase = Depends(get_current_user)):
    db = get_db()
    doc = db.collection("behaviorProfiles").document(current_user.email).get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Profile not found. Take the test first.")
    
    return BehaviorProfile(**doc.to_dict())
