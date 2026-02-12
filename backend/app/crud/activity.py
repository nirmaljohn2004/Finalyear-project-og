from typing import List, Optional
from app.crud.base import CRUDBase
from pydantic import BaseModel
from datetime import datetime

class ActivityCreate(BaseModel):
    user_id: str
    activity_type: str
    title: str
    metadata: dict = {}
    timestamp: str

class CRUDActivity(CRUDBase[BaseModel, ActivityCreate, BaseModel]):
    def log_activity(
        self, 
        user_id: str, 
        activity_type: str, 
        title: str, 
        metadata: dict = None
    ) -> dict:
        """
        Log a new user activity.
        
        Activity Types:
        - TOPIC_COMPLETED: User mastered a topic
        - TOPIC_PRACTICING: User is practicing a weak topic
        - TOPIC_STARTED: User started a new topic
        - COMPETITIVE_SOLVED: User solved a competitive problem
        - INTERVIEW_COMPLETED: User completed an AI interview
        - DIAGNOSTIC_TAKEN: User completed a psychometric test
        """
        activity_data = {
            "user_id": user_id,
            "activity_type": activity_type,
            "title": title,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Use direct Firestore set instead of CRUD create to avoid BaseModel issues
        from app.db.firestore import get_db
        db = get_db()
        doc_ref = self.collection.document()
        doc_ref.set(activity_data)
        
        activity_data['id'] = doc_ref.id
        return activity_data
    
    def get_recent_activities(self, user_id: str, limit: int = 6) -> List[dict]:
        """
        Get the most recent activities for a user.
        Fetches all activities and sorts in Python to avoid Firestore index requirements.
        """
        from app.db.firestore import get_db
        db = get_db()
        
        # Fetch all activities for this user
        query = self.collection.where("user_id", "==", user_id)
        docs = list(query.stream())
        
        # Convert to list of dicts
        activities = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            activities.append(data)
        
        # Sort by timestamp (most recent first)
        activities.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        # Return only the requested number
        return activities[:limit]

# Create singleton instance
activity = CRUDActivity("userActivity")
