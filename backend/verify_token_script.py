
import firebase_admin
from firebase_admin import auth, credentials
import os

# Force reset of any existing apps
if len(firebase_admin._apps) > 0:
    for app_name in list(firebase_admin._apps.keys()):
        firebase_admin.delete_app(firebase_admin.get_app(app_name))

try:
    print("Initializing Firebase Admin...")
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    print(f"Initialized with project: {cred.project_id}")

    if not os.path.exists("last_token.txt"):
        print("Error: last_token.txt not found")
        exit(1)

    with open("last_token.txt", "r") as f:
        token = f.read().strip()
    
    print(f"Read token (len={len(token)})...")
    
    # Try verifying
    try:
        decoded = auth.verify_id_token(token, check_revoked=True)
        print("SUCCESS! Token verified.")
        print(f"UID: {decoded['uid']}")
        print(f"Email: {decoded['email']}")
    except Exception as e:
        print(f"VERIFICATION FAILED: {e}")
        # Print details about exception
        if hasattr(e, 'http_response'):
             print(f"HTTP Response: {e.http_response}")
             
except Exception as e:
    print(f"Script Error: {e}")
