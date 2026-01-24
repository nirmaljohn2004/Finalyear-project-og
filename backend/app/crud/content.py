from typing import List, Optional
from app.crud.base import CRUDBase
from pydantic import BaseModel

class CRUDStaticContent(CRUDBase[BaseModel, BaseModel, BaseModel]):
    def get_by_topic(self, topic_id: str) -> Optional[dict]:
        # Assuming topic_id is the document ID for static content
        return self.get(topic_id)

class CRUDTopicQuiz(CRUDBase[BaseModel, BaseModel, BaseModel]):
    def get_by_topic(self, topic_id: str) -> Optional[dict]:
         # Assuming topic_id is the document ID for quizzes
        return self.get(topic_id)

static_content = CRUDStaticContent("staticContent")
topic_quiz = CRUDTopicQuiz("topicQuizzes")
