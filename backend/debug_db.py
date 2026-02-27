
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = "serviceAccountKey.json"
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        print(f"Error: {cred_path} not found.")
        exit(1)

db = firestore.client()

def list_users():
    print("--- Inspecting users ---")
    docs = db.collection("users").stream()
    for doc in docs:
        print(f"User Email: {doc.id}, Data: {doc.to_dict()}")

def inspect_progress():
    print("--- Inspecting topicProgress (CamelCase) ---")
    docs = db.collection("topicProgress").stream()
    count = 0
    for doc in docs:
        data = doc.to_dict()
        print(f"Doc ID: {doc.id}")
        print(f"  User: {data.get('user_id')}")
        print(f"  Topic: {data.get('topic_id')}")
        print(f"  Status: {data.get('status')} (Type: {type(data.get('status'))})")
        count += 1
    print(f"Total documents: {count}")

if __name__ == "__main__":
    list_users()
    inspect_progress()
