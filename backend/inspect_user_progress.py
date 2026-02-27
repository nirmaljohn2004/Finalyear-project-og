
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
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

def inspect_user_progress(email):
    print(f"--- Inspecting progress for {email} ---")
    docs = db.collection("topicProgress").where(filter=FieldFilter("user_id", "==", email)).stream()
    
    count = 0
    mastered_count = 0
    seen_topics = set()
    
    for doc in docs:
        data = doc.to_dict()
        topic_id = data.get("topic_id")
        status = data.get("status")
        print(f"Topic: {topic_id} | Status: {status} | Updated: {data.get('updatedAt')}")
        
        count += 1
        if status == "MASTERED":
            mastered_count += 1
            seen_topics.add(topic_id)
            print(f"MASTERED FOUND: {topic_id} | Updated: {data.get('updatedAt')}")
            
    print(f"Total Docs: {count}")
    print(f"Mastered Count (Raw): {mastered_count}")
    print(f"Unique Mastered Topics: {len(seen_topics)}")
    print("--- Detailed Topic IDs ---")
    for t in seen_topics:
        print(f"- {t}")

if __name__ == "__main__":
    inspect_user_progress("nirmaljohn2004@gmail.com")
