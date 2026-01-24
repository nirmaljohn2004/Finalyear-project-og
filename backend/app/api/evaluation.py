from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from app.db.firestore import get_db
from app.api.auth import get_current_user
from app.models.user import UserBase
from app.agents.evaluator_agent import EvaluatorAgent

router = APIRouter()

class CodeSubmission(BaseModel):
    code: str
    problem: str
    language: str

class EvaluationResult(BaseModel):
    mastery: str
    feedback: str
    weak_areas: List[str]

@router.post("/", response_model=EvaluationResult)
async def evaluate_code(submission: CodeSubmission, current_user: UserBase = Depends(get_current_user)):
    agent = EvaluatorAgent()
    result = agent.process(submission.dict())
    
    # Save attempt
    db = get_db()
    # db.collection("attempts").add(...)
    
    return EvaluationResult(**result)
