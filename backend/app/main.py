from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Learning Platform API")

# CORS configuration
origins = [
    "http://localhost:3000",  # React app
    "http://localhost:3001",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import auth

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
from app.api import learning
app.include_router(learning.router, prefix="/api/v1/learning", tags=["learning"])
print("DEBUG: Learning Router Registered at /api/v1/learning")
from app.api import profile
app.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])
from app.api import diagnostic
app.include_router(diagnostic.router, prefix="/api/v1/diagnostic", tags=["diagnostic"])
from app.api import evaluation
app.include_router(evaluation.router, prefix="/api/v1/evaluate", tags=["evaluation"])
from app.api import chat
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
print("DEBUG: Chat Router Registered at /api/v1/chat")

from app.api import users
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

from app.api import execution
app.include_router(execution.router, prefix="/api/v1/execution", tags=["execution"])

from app.api import competitive
app.include_router(competitive.router, prefix="/api/v1/competitive", tags=["competitive"])

from app.api import interview
app.include_router(interview.router, prefix="/api/v1/interview", tags=["interview"])

from app.api import certificate
app.include_router(certificate.router, prefix="/api/v1/certificate", tags=["certificate"])

from app.api import ws_interview
app.include_router(ws_interview.router, prefix="/api/v1/ws", tags=["websocket"])

from fastapi.staticfiles import StaticFiles
import os

# Mount uploads directory to serve static files (resumes)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/")
def read_root():
    # Reload trigger 6 (Final)
    return {"message": "Welcome to the AI Learning Platform API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

