import json
from app.core.llm import llm_client

prompt = """
You are the Supervisor of an AI Learning Platform.
Analyze the user's message and select the best worker node to handle it.

Worker Nodes:
- 'chat': General coding questions, greetings, help, chit-chat.

Return ONLY a JSON object: {"next_node": "..."}

User Message: hello
"""

try:
    print("Testing LLM generation...")
    res = llm_client.generate(prompt)
    print(f"RAW RES: '{res}'")
    
    # Simulate supervisor node logic
    cleaned = res.replace("```json", "").replace("```", "").strip()
    print(f"CLEANED: '{cleaned}'")
    
    data = json.loads(cleaned)
    print(f"PARSED: {data}")
except Exception as e:
    print(f"Error parsing json: {e}")
