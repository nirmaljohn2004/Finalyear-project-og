
import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.core.config import settings
import os

# Global instances
_db = None
_app = None

def initialize_firebase():
    global _app, _db
    if not firebase_admin._apps:
        try:
            print("Initializing Firebase Admin (Centralized)...")
            cred_path = settings.FIREBASE_CREDENTIALS_PATH
            if not os.path.exists(cred_path):
                 # Try absolute path if relative fails, or check if it's in root
                 if os.path.exists(os.path.join(os.getcwd(), cred_path)):
                     cred_path = os.path.join(os.getcwd(), cred_path)
            
            cred = credentials.Certificate(cred_path)
            _app = firebase_admin.initialize_app(cred)
            print("Firebase Admin Initialized Successfully.")
        except Exception as e:
            print(f"CRITICAL: Failed to initialize Firebase Admin: {e}")
            raise e
    else:
        _app = firebase_admin.get_app()
    
    if _db is None:
        _db = firestore.client()
        
    return _app

def get_db():
    global _db
    if _db is None:
        initialize_firebase()
    return _db

def verify_token(token):
    # Ensure app is initialized
    if not firebase_admin._apps:
        initialize_firebase()
    
    # Verify token
    return auth.verify_id_token(token)
