from app.core.firebase_app import get_db as _get_db
# Global variable to hold the db client
db = None

def get_db():
   return _get_db()

