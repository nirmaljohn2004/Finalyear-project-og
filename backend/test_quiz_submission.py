
import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/auth/token"
SUBMIT_URL_TEMPLATE = f"{BASE_URL}/api/v1/learning/topic/{{language}}/{{topic_id}}/submit"

# Test User Credentials (ensure these exist in your DB or use a known user)
USERNAME = "test@example.com" 
PASSWORD = "password123"

def get_access_token():
    try:
        response = requests.post(
            LOGIN_URL, 
            data={"username": USERNAME, "password": PASSWORD},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            print(f"Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_submission():
    # token = get_access_token()
    # if not token:
    #     print("Skipping test due to login failure.")
    #     return
    token = "mock_token" # Auth bypassed in backend

    # Simulation Data for "Python Basics"
    language = "Python"
    topic_id = "Basics" # Verify this ID matches what frontend uses! 
    # Actually frontend uses topic ID from URL. Let's assume "1" or "Basics".
    # Based on learning.py logic: unique_topic_id = f"{language}_{topic_id}"
    
    url = SUBMIT_URL_TEMPLATE.format(language=language, topic_id=topic_id)
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "submission": [
            {"questionId": 1, "selectedOption": "A"},
            {"questionId": 2, "selectedOption": "B"}
        ],
        "totalQuestions": 2
    }
    
    print(f"Submitting to {url}...")
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_submission()
