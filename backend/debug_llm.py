from app.core.config import settings
from app.core.llm import LLMClient

try:
    print(f"API Key start: {settings.GEMINI_API_KEY[:5]}...")
    client = LLMClient()
    print("Testing chat completion...")
    res = client.chat_completion([{"role": "user", "content": "Say 'hello world' and nothing else."}])
    print(f"Response: {res}")
except Exception as e:
    print(f"Error test script: {e}")
