import google.generativeai as genai
import os
from app.core.config import settings

def list_models():
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        print("No API Key found")
        return

    genai.configure(api_key=api_key)
    
    print(f"Checking models with key: {api_key[:5]}...")
    
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_models()
