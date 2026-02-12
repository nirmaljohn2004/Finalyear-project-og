from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from langchain_core.messages import HumanMessage, AIMessage
from app.api.auth import get_current_user
from app.models.user import UserBase
from app.db.firestore import get_db

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatMessage(BaseModel):
    id: str
    sender: str
    text: str # Matches frontend 'text' field
    timestamp: datetime

class ChatResponse(BaseModel):
    response: str

@router.get("", response_model=List[ChatMessage])
async def get_chat_history(current_user: UserBase = Depends(get_current_user)):
    try:
        db = get_db()
        # Subcollection 'messages' under 'chat_history/{user_email}'
        # or root collection 'chat_messages' with user_id index.
        # Let's use subcollection for clean hierarchy: users/{email}/chat_history/{msg_id}
        
        # Actually easier to query root collection with index, but subcollection is fine for simple history
        docs = db.collection("users").document(current_user.email).collection("chat_history")\
            .order_by("timestamp", direction="ASCENDING").limit(50).stream()
            
        history = []
        for doc in docs:
            data = doc.to_dict()
            # Convert timestamp to datetime if specific format needed, Pydantic handles datetime obj
            history.append(ChatMessage(
                id=doc.id,
                sender=data.get("sender"),
                text=data.get("text"),
                timestamp=data.get("timestamp")
            ))
        return history
    except Exception as e:
        print(f"Error fetching chat history: {e}")
        return []

@router.post("", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, current_user: UserBase = Depends(get_current_user)):
    try:
        # Get DB access
        db = get_db()
        user_ref = db.collection("users").document(current_user.email)
        history_ref = user_ref.collection("chat_history")
        
        # 1. Fetch Profile for State
        doc_profile = db.collection("behaviorProfiles").document(current_user.email).get()
        user_profile = doc_profile.to_dict() if doc_profile.exists else {}

        # 2. Invoke Graph
        from app.graph.workflow import app_graph
        from langchain_core.messages import HumanMessage
        
        # We start with the user's new message. 
        # Ideally we'd hydrate 'messages' with recent history from DB for context,
        # but for now we follow the improved architecture where the graph manages the run.
        # But wait, LangGraph `state` expects the full history if we want context.
        # Let's fetch last 5 messages for context.
        
        recent_docs = history_ref.order_by("timestamp", direction="DESCENDING").limit(5).stream()
        history_msgs = []
        # Firestore returns descending, so we reverse to be chronological
        for doc in sorted(list(recent_docs), key=lambda x: x.get("timestamp")):
             d = doc.to_dict()
             sender = d.get("sender")
             text = d.get("text")
             if sender == "user":
                 history_msgs.append(HumanMessage(content=text))
             else:
                 history_msgs.append(AIMessage(content=text))
                 
        # Add current message
        current_human_msg = HumanMessage(content=request.message)
        history_msgs.append(current_human_msg)
        
        initial_state = {
            "messages": history_msgs,
            "user_profile": user_profile,
            "user_email": current_user.email,
            "payload": {} 
        }
        
        result = app_graph.invoke(initial_state)
        
        # 3. Extract Response
        # The result messages list will have the AIMessage appended at the end
        output_messages = result.get("messages", [])
        if output_messages:
            last_msg = output_messages[-1]
            response_text = last_msg.content
        else:
            response_text = "I couldn't generate a response."

        # 4. Save to DB (Persistence)
        # Save User Message
        history_ref.add({
            "sender": "user",
            "text": request.message,
            "timestamp": datetime.utcnow()
        })
        
        # Save AI Response
        history_ref.add({
            "sender": "ai",
            "text": response_text,
            "timestamp": datetime.utcnow()
        })
        
        return {"response": response_text}
        
    except Exception as e:
        if "AI_QUOTA_EXCEEDED" in str(e):
            raise HTTPException(status_code=429, detail="Daily AI usage limit reached. Please try again tomorrow.")
        print(f"Chat Graph Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
