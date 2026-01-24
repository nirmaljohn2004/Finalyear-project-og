
import firebase_admin
from firebase_admin import credentials
import json

try:
    cred = credentials.Certificate("serviceAccountKey.json")
    print(f"Credential Project ID: {cred.project_id}")
    print(f"Credential Service Account: {cred.service_account_email}")
    
    # Also manual check of json
    with open("serviceAccountKey.json", "r") as f:
        data = json.load(f)
        print(f"JSON Project ID: {data.get('project_id')}")
        
except Exception as e:
    print(f"Error: {e}")
