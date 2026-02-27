
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

def cleanup_invalid_progress(email):
    """
    Remove progress entries with invalid topic_id format.
    Valid format: {Language}_{TopicID} (e.g., Python_Basics, Java_Collections)
    Invalid: bare numbers like "1", "6", "python_1"
    """
    print(f"--- Cleaning up invalid progress for {email} ---")
    
    # Get all progress docs for this user
    docs = db.collection("topicProgress").where(filter=FieldFilter("user_id", "==", email)).stream()
    
    deleted_count = 0
    kept_count = 0
    
    for doc in docs:
        data = doc.to_dict()
        topic_id = data.get("topic_id", "")
        
        # Valid topic IDs should have format: Language_TopicName
        # e.g., Python_Basics, Java_Collections
        # Invalid: "1", "6", "python_1" (lowercase language)
        
        is_valid = False
        if "_" in topic_id:
            parts = topic_id.split("_")
            # Check if language part starts with uppercase (Python, Java)
            if len(parts) >= 2 and parts[0] and parts[0][0].isupper():
                is_valid = True
        
        if not is_valid:
            print(f"DELETING: {doc.id} | Topic: {topic_id} | Status: {data.get('status')}")
            doc.reference.delete()
            deleted_count += 1
        else:
            print(f"KEEPING: {doc.id} | Topic: {topic_id} | Status: {data.get('status')}")
            kept_count += 1
    
    print(f"\nDeleted: {deleted_count} invalid entries")
    print(f"Kept: {kept_count} valid entries")

if __name__ == "__main__":
    cleanup_invalid_progress("nirmaljohn2004@gmail.com")
