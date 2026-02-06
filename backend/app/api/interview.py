from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
from app.graph.workflow import app_graph
from langchain_core.messages import HumanMessage, AIMessage

class InterviewContext(BaseModel):
    topic: str
    difficulty: str
    history: List[Dict[str, str]] = []

router = APIRouter()
# agent = InterviewAgent() - Removed logic


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
    
    # Generate opening message via Graph
    # The Supervisor will route to InterviewNode because of payload 'interview_topic'
    graph_input = {
        "payload": {
            "interview_topic": req.topic,
            "difficulty": req.difficulty
        },
        "messages": [],
        "user_profile": {},
        "user_email": "guest_interviewer"
    }
    
    result = app_graph.invoke(graph_input)
    # The InterviewNode adds the response to messages
    if result["messages"]:
        opening_message = result["messages"][-1].content
    else:
        opening_message = "Hello, I am ready to interview you."
        
    
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
    
    # Reconstruct history for LangGraph
    history_msgs = []
    for msg in context.history:
        if msg["role"] == "user":
            history_msgs.append(HumanMessage(content=msg["content"]))
        else:
            history_msgs.append(AIMessage(content=msg["content"]))
            
    # Add current user message
    history_msgs.append(HumanMessage(content=req.message))
    
    # Invoke Graph
    # Supervisor will route to InterviewNode because of implicit context? 
    # Or should we force it via payload? 
    # Since we are in an "/interview" endpoint, use Payload to force routing!
    graph_input = {
        "messages": history_msgs,
        "payload": {
             "interview_topic": context.topic, # Force routing to interview node
             "difficulty": context.difficulty
        },
        "user_profile": {},
        "user_email": "guest_interviewer"
    }
    
    result = app_graph.invoke(graph_input)
    ai_response = result["messages"][-1].content if result["messages"] else "..."
    
    # Update history
    context.history.append({"role": "user", "content": req.message})
    context.history.append({"role": "assistant", "content": ai_response})
    
    return MessageResponse(message=ai_response)
