from typing import Dict, Any, Literal
from app.core.state import AgentState
from app.core.llm import llm_client
import json

def supervisor_node(state: AgentState) -> Dict[str, Any]:
    """
    The Supervisor Node acts as the router.
    It analyzes the user's intent from the 'messages' or 'payload' 
    and determines the 'next_node'.
    """
    print("--- SUPERVISOR NODE ---")
    
    messages = state.get("messages", [])
    payload = state.get("payload", {})
    
    # 1. Check Payload First (Explicit routing)
    # If the API endpoint manually set the payload with specific intent, use it.
    if payload:
        # Check for explicit flags in payload? Or generic routing?
        # For now, let's assume the API caller might have set a hidden "intent" field in payload
        # or we infer from keys.
        
        if "quiz_results" in payload:
            print("Supervisor: Routing to SkillNode (Payload has quiz_results)")
            return {"next_node": "skill"}
            
        if "topic_id" in payload:
            print("Supervisor: Routing to ContentNode (Payload has topic_id)")
            return {"next_node": "content"}
            
        if "submission" in payload:
            print("Supervisor: Routing to EvaluatorNode (Payload has submission)")
            return {"next_node": "evaluate"}
            
        if "interview_topic" in payload:
            print("Supervisor: Routing to InterviewNode (Payload has interview_topic)")
            return {"next_node": "interview"}

    # 2. Analyze Chat Message (Implicit routing)
    if not messages:
        # No messages and no recognizable payload? End.
        return {"next_node": "end"}
        
    last_message = messages[-1]
    content = last_message.content if hasattr(last_message, "content") else str(last_message)
    
    # Simple heuristic fallback (faster than LLM for obvious keywords)
    content_lower = content.lower()
    if "interview" in content_lower and "start" in content_lower:
         return {"next_node": "interview"}
         
    # 3. LLM Routing (The "Brain")
    # We ask the LLM to classify the intent.
    system_prompt = """
    You are the Supervisor of an AI Learning Platform.
    Analyze the user's message and select the best worker node to handle it.
    
    Worker Nodes:
    - 'chat': General coding questions, greetings, help, chit-chat.
    - 'skill': Requests to generate a syllabus, learning path, or identify skills (e.g., "Create a Python path").
    - 'content': Requests to explain a specific topic indepth or generate a lesson (e.g., "Explain recursion").
    - 'interview': Requests to start a mock interview.
    
    Return ONLY a JSON object: {"next_node": "..."}
    """
    
    routing_prompt = f"{system_prompt}\n\nUser Message: {content}"
    
    try:
        response_text = llm_client.generate(routing_prompt)
        # Clean response (remove backticks if any)
        cleaned_response = response_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned_response)
        next_node = data.get("next_node", "chat")
    except Exception as e:
        print(f"Supervisor LLM Error: {e}. Fallback to 'chat'.")
        next_node = "chat"
        
    print(f"Supervisor: Routing to {next_node}")
    return {"next_node": next_node}
