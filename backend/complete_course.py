
import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Hack to avoid import errors if .env not loaded by main
from dotenv import load_dotenv
load_dotenv()

from app.core.firebase_app import initialize_firebase, get_db
from app.crud.learning import learning_path
# from app.models.enums import TopicStatus # Avoid enum import if it causes issues, just use string

def complete_course_for_user():
    print("Initializing Firebase...")
    initialize_firebase()
    db = get_db()
    
    # 1. Find the target user (assuming single user dev env or first found)
    users_ref = db.collection("users")
    users = list(users_ref.stream())
    
    if not users:
        print("No users found in database.")
        return

    # Just pick the first one for simplicity in this interaction
    target_user = users[0]
    email = target_user.id
    print(f"Targeting User: {email} ({target_user.to_dict().get('name')})")
    
    language = "python"
    level = "intermediate"
    
    # 2. Get Path
    path_id = f"{email}_{language}_{level}"
    print(f"fetching path {path_id}")
    path_doc = learning_path.get(path_id)
    
    if not path_doc:
        print(f"[-] Path {path_id} not found. Trying to find ANY path...")
        # Try finding any path for this user
        # This is tricky with composite keys in top level. 
        # But we know the user is likely on python/intermediate from context.
        return

    topics = path_doc.get("orderedTopics", [])
    print(f"[*] Found {len(topics)} topics in {path_id}.")
    
    # 3. Update Progress for each
    batch = db.batch()
    count = 0
    
    for topic in topics:
        t_id_raw = topic.get("id") or topic.get("title")
        t_id = str(t_id_raw)
        
        doc_id = f"{email}_{t_id}"
        doc_ref = db.collection("topicProgress").document(doc_id)
        
        # Use simple dictionary update
        update_data = {
            "user_id": email,
            "topic_id": t_id,
            "status": "MASTERED",
            "last_score": 100,
            "attempts": 1,
            "updatedAt": "2025-01-01T00:00:00"
        }
        
        batch.set(doc_ref, update_data, merge=True)
        count += 1
        
    batch.commit()
    print(f"[+] Successfully marked {count} topics as MASTERED for {email}.")

if __name__ == "__main__":
    try:
        complete_course_for_user()
    except Exception as e:
        print(f"Error: {e}")
