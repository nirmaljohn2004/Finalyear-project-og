from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.core.llm import llm_client
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
        db = get_db()
        user_ref = db.collection("users").document(current_user.email)
        history_ref = user_ref.collection("chat_history")
        
        # 1. Save User Message
        user_msg_data = {
            "sender": "user",
            "text": request.message,
            "timestamp": datetime.utcnow()
        }
        history_ref.add(user_msg_data)
        
        # 2. Retrieve user profile for context
        # Check behaviorProfiles separate collection ? Or user doc? 
        # Previous code used behaviorProfiles collection. Keeping that.
        doc_profile = db.collection("behaviorProfiles").document(current_user.email).get()
        
        system_context = ""
        if doc_profile.exists:
            profile = doc_profile.to_dict()
            system_context = f"""
            Interact with the student based on their profile:
            - Learning Preference: {profile.get('learning_preference', 'Practical')}
            - Learning Speed: {profile.get('learning_speed', 'Moderate')}
            - Difficulty Comfort: {profile.get('difficulty_comfort', 'Medium')}
            - Feedback Style: {profile.get('feedback_style', 'Hints')}
            - Goal Orientation: {profile.get('goal_orientation', 'Projects')}
            """
        
        # 3. Generate AI Response
        # Ideally we fetch recent history to pass to LLM as context too! 
        # For now, just context + message
        full_prompt = f"{system_context}\n\nUser Question: {request.message}"
        response_text = llm_client.generate(full_prompt)
        
        # 4. Save AI Response
        ai_msg_data = {
            "sender": "ai",
            "text": response_text,
            "timestamp": datetime.utcnow()
        }
        history_ref.add(ai_msg_data)
        
        return {"response": response_text}
    except Exception as e:
        if "AI_QUOTA_EXCEEDED" in str(e):
            raise HTTPException(status_code=429, detail="Daily AI usage limit reached. Please try again tomorrow.")
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
