from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional, List
from app.api.auth import get_current_user
from app.models.user import UserBase, UserUpdate
from app.db.firestore import get_db
import shutil
import os
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/me", response_model=UserBase)
async def read_users_me(current_user: UserBase = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserBase)
async def update_user_me(user_update: UserUpdate, current_user: UserBase = Depends(get_current_user)):
    db = get_db()
    user_ref = db.collection("users").document(current_user.email)
    
    # Filter out None values
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if update_data:
        print(f"DEBUG: Updating user {current_user.email} with data: {update_data}")
        user_ref.update(update_data)
        
        # Determine the updated state
        updated_snapshot = user_ref.get()
        return UserBase(**updated_snapshot.to_dict())
    
    return current_user

@router.post("/me/resume")
async def upload_resume(file: UploadFile = File(...), current_user: UserBase = Depends(get_current_user)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Create a safe filename
    filename = f"{current_user.email}_resume.pdf"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
        
    # Update user profile with resume URL
    # Assuming serving from /static/uploads/
    resume_url = f"/static/uploads/{filename}"
    
    db = get_db()
    db.collection("users").document(current_user.email).update({"resume_url": resume_url})
    
    return {"resume_url": resume_url}
