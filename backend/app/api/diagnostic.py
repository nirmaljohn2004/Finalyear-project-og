from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from app.db.firestore import get_db
from app.api.auth import get_current_user
from app.models.user import UserBase
from app.agents.skill_identifier_agent import SkillIdentifierAgent

router = APIRouter()

class DiagnosticSubmission(BaseModel):
    answers: Dict[str, Any]

class DiagnosticResult(BaseModel):
    topic_scores: Dict[str, float]
    priority_queue: List[str]

@router.post("/submit", response_model=DiagnosticResult)
async def submit_diagnostic(submission: DiagnosticSubmission, current_user: UserBase = Depends(get_current_user)):
    agent = SkillIdentifierAgent()
    result = agent.process(submission.answers)
    
    db = get_db()
    # Save diagnostic results
    # db.collection("diagnostics").document(current_user.email).set(result) # timestamped ideally
    
    return DiagnosticResult(**result)
