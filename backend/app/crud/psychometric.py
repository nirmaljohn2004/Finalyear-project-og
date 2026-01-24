from typing import Optional
from app.crud.base import CRUDBase
from pydantic import BaseModel

class CRUDPsychometricProfile(CRUDBase[BaseModel, BaseModel, BaseModel]):
    def get_by_user(self, user_id: str) -> Optional[dict]:
        return self.get(user_id)

psychometric_profile = CRUDPsychometricProfile("psychometricProfiles")
