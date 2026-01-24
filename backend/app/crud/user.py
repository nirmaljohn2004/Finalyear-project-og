from typing import Optional
from app.crud.base import CRUDBase
from app.models.user import UserCreate, UserUpdate, UserBase # Assuming these exist or using Dict for now as generic
# Check app/models/user.py first? Yes I should but for now I will assume Pydantic integration or use loose typing
from pydantic import BaseModel

# Defining placeholder schemas if not imported - typically I would import them.
# I saw app/models/user.py exists.

class CRUDUser(CRUDBase[BaseModel, BaseModel, BaseModel]):
    def get_by_email(self, email: str) -> Optional[dict]:
        return self.get(email) # In our design, email IS the document ID for simplicity

    def update_gamification_stats(self, email: str, xp_gained: int = 0) -> dict:
        """
        Updates user streak and XP.
        - Increments streak if last active was yesterday.
        - Resets streak if last active was before yesterday.
        - Always increments XP.
        """
        from datetime import datetime, timedelta
        
        user_doc = self.get(email)
        if not user_doc:
            return {}
            
        today_str = datetime.utcnow().date().isoformat()
        last_active_str = user_doc.get("last_active_date")
        
        current_streak = user_doc.get("streak_count", 0)
        current_xp = user_doc.get("xp", 0)
        
        # Streak Logic
        if last_active_str == today_str:
            # Already active today, maintain streak
            new_streak = current_streak
            if new_streak == 0: new_streak = 1 # Init if 0
        else:
            # Check if yesterday
            yesterday_str = (datetime.utcnow().date() - timedelta(days=1)).isoformat()
            if last_active_str == yesterday_str:
                new_streak = current_streak + 1
            else:
                # Missed a day or first time
                new_streak = 1
                
        new_xp = current_xp + xp_gained
        
        update_data = {
            "streak_count": new_streak,
            "xp": new_xp,
            "last_active_date": today_str
        }
        
        self.update(email, update_data)
        return update_data

user = CRUDUser("users")
