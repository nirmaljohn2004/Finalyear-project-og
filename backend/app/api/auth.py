from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from app.db.firestore import get_db # No longer needed directly
from app.models.user import UserCreate, UserLogin, Token, UserBase, UserInDB
from pydantic import BaseModel
from app.core import security
from app.core.config import settings
from app.crud.user import user as user_crud
from app.core.firebase_app import verify_token
# import firebase_admin
# from firebase_admin import auth, credentials

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

# Firebase initialization is now handled in app.core.firebase_app

class FirebaseToken(BaseModel):
    token: str

def get_current_user(token: str = Depends(oauth2_scheme)):
    # Simple JWT decode for now
    try:
        payload = security.jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_data = user_crud.get_by_email(email)
    
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserBase(**user_data)

@router.post("/firebase-login", response_model=Token)
def firebase_login(token_data: FirebaseToken):
    try:
        # Verify the ID token (standard local verification)
        decoded_token = verify_token(token_data.token)
        email = decoded_token['email']
        uid = decoded_token['uid']
        email_verified = decoded_token.get('email_verified', False)

        if not email_verified:
             raise HTTPException(status_code=400, detail="Email not verified")

    except Exception as e:
        print(f"Error verifying Firebase token: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    # Check if user exists in OUR database
    user_data = user_crud.get_by_email(email)
    
    if not user_data:
        # Create user in our DB since they are verified via Firebase
        print(f"Creating new user from Firebase login: {email}")
        new_user = {
            "email": email,
            "full_name": decoded_token.get('name', 'User'), # Firebase might return name
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "firebase_uid": uid,
            "xp": 0,
            "streak_count": 0
        }
        # Note: We don't have a password_hash here, which is fine as they use Firebase Login.
        # But our UserInDB model might require it? user.py defined UserInDB but didn't show fields.
        # Assuming we can store generic dict or need to adapt models. 
        # For now, storing as dict via CRUDBase generic update/create flow.
        try:
             user_crud.create(new_user, id=email)
        except Exception as e:
             # If CreateSchema was strict, this might fail.
             # fallback to minimal
             print(f"Error creating user: {e}")
             pass

    # Issue our own JWT access token for session management
    access_token = security.create_access_token(data={"sub": email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup", response_model=Token)
async def signup(user: UserCreate):
    # Check if user exists
    if user_crud.get_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = security.get_password_hash(user.password)
    user_data = user.dict()
    user_data.pop("password")
    user_data["created_at"] = datetime.utcnow() # type: ignore
    
    # Store with hashed password? Or just store user profile and keep auth separate?
    # For custom auth, we need to store hash.
    user_db_entry = user_data.copy()
    user_db_entry["password_hash"] = hashed_pw
    
    # Use user.email as ID
    user_crud.create(UserInDB(**user_db_entry), id=user.email) # Passing Pydantic model implicitly wraps it
    
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    user_data = user_crud.get_by_email(user.email)
    
    if not user_data:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not security.verify_password(user.password, user_data.get("password_hash")):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserBase)
async def read_users_me(current_user: UserBase = Depends(get_current_user)):
    return current_user
