from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr
    name: str
    # Profile fields
    bio: Optional[str] = None
    github_link: Optional[str] = None
    linkedin_link: Optional[str] = None
    website_link: Optional[str] = None
    skills: List[str] = []
    resume_url: Optional[str] = None
    
    # Gamification
    xp: int = 0
    streak_count: int = 0
    last_active_date: Optional[str] = None # ISO format date string

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserBase):
    password_hash: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    github_link: Optional[str] = None
    linkedin_link: Optional[str] = None
    website_link: Optional[str] = None
    skills: Optional[List[str]] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
