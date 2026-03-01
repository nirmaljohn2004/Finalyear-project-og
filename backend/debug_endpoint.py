import asyncio
from app.api.chat import chat_endpoint, ChatRequest
from app.models.user import UserBase

def fake_test():
    user = UserBase(email="test@demo.com", name="Test User")
    req = ChatRequest(message="Hello there")
    
    print("Testing chat_endpoint directly...")
    try:
        res = chat_endpoint(request=req, current_user=user)
        print(f"SUCCESS: {res}")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    fake_test()
