from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
from app.agents.interview_agent import InterviewAgent, InterviewContext

router = APIRouter()
agent = InterviewAgent()

# In-memory session store for MVP
# In production, use Redis or Database
sessions: Dict[str, InterviewContext] = {}

class StartInterviewRequest(BaseModel):
    topic: str
    difficulty: str

class InterviewMessageRequest(BaseModel):
    session_id: str
    message: str

class StartResponse(BaseModel):
    session_id: str
    message: str

class MessageResponse(BaseModel):
    message: str

@router.post("/start", response_model=StartResponse)
async def start_interview(req: StartInterviewRequest):
    session_id = str(uuid.uuid4())
    
    # Generate opening message
    opening_message = agent.start_interview(req.topic, req.difficulty)
    
    # Init context
    context = InterviewContext(
        topic=req.topic,
        difficulty=req.difficulty,
        history=[
            {"role": "assistant", "content": opening_message}
        ]
    )
    sessions[session_id] = context
    
    return StartResponse(session_id=session_id, message=opening_message)

@router.post("/chat", response_model=MessageResponse)
async def chat_interview(req: InterviewMessageRequest):
    session_id = req.session_id
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    context = sessions[session_id]
    
    # Add user message to history
    # context.history.append({"role": "user", "content": req.message}) # We do this in the agent loop logically, but let's persist it
    
    # Get response
    ai_response = agent.chat(context, req.message)
    
    # Update history
    context.history.append({"role": "user", "content": req.message})
    context.history.append({"role": "assistant", "content": ai_response})
    
    return MessageResponse(message=ai_response)
