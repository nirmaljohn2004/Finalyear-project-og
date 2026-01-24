
import firebase_admin
from firebase_admin import credentials, firestore
import time
import datetime

def check_firestore():
    try:
        print(f"System Time: {datetime.datetime.now()}")
        if not firebase_admin._apps:
            cred = credentials.Certificate("serviceAccountKey.json")
            firebase_admin.initialize_app(cred)
            print("Initialized Firebase Admin.")
            
        db = firestore.client()
        print("Got Firestore Client.")
        
        # Try to read a collection (limit 1)
        print("Attempting to list users...")
        users = list(db.collection('users').limit(1).stream())
        print(f"Success! Found {len(users)} users.")
        for user in users:
            print(f"User ID: {user.id}")
            
    except Exception as e:
        print(f"Firestore Error: {e}")

if __name__ == "__main__":
    check_firestore()
