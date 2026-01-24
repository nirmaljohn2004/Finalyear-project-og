from typing import List, Optional
from app.crud.base import CRUDBase
from app.models.enums import TopicStatus
from pydantic import BaseModel

# Schemas (Internal for now, should be in app/schemas or models)
class TopicProgressCreate(BaseModel):
    user_id: str
    topic_id: str
    status: TopicStatus = TopicStatus.NOT_ATTEMPTED

class TopicProgressUpdate(BaseModel):
    status: TopicStatus

class CRUDLearningPath(CRUDBase[BaseModel, BaseModel, BaseModel]):
    def get_by_user(self, user_id: str) -> Optional[dict]:
        # Assuming one active path per user, stored with ID = user_id
        return self.get(user_id)

    def create_path(self, user_id: str, path_data: dict) -> dict:
        return self.create(BaseModel(**path_data), id=user_id) # loose typing for now

class CRUDTopicProgress(CRUDBase[BaseModel, TopicProgressCreate, TopicProgressUpdate]):
    def get_progress(self, user_id: str, topic_id: str) -> Optional[dict]:
        return self.get(f"{user_id}_{topic_id}")

    def update_status(self, user_id: str, topic_id: str, status: TopicStatus) -> dict:
        doc_id = f"{user_id}_{topic_id}"
        # We need to create if not exists, or update
        # Check if exists
        curr = self.get(doc_id)
        if not curr:
            # Create
            data = {"user_id": user_id, "topic_id": topic_id, "status": status.value}
            self.collection.document(doc_id).set(data)
            return data
        else:
            # Update
            self.update(doc_id, {"status": status.value})
            curr["status"] = status.value
            return curr

learning_path = CRUDLearningPath("learningPaths")
topic_progress = CRUDTopicProgress("topicProgress")
