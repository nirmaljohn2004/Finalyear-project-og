from typing import Dict, Any, List
from app.core.state import AgentState
from app.core.llm import llm_client
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

def interview_node(state: AgentState) -> Dict[str, Any]:
    """
    Conducts a mock interview.
    """
    print("--- INTERVIEW NODE ---")
    
    payload = state.get("payload", {})
    messages = state.get("messages", [])
    
    topic = payload.get("interview_topic", "General Coding")
    difficulty = payload.get("difficulty", "Medium")
    
    system_prompt = f"""
    You are an expert Technical Interviewer for a top-tier tech company.
    Your goal is to conduct a realistic mock interview about {topic} ({difficulty}).
    Always make your response concise and short.
    
    Personality:
    - Professional, polite, but rigorous.
    - Ask "why" and "how".
    
    Process:
    1. If this is the start, welcome the candidate and ask the first question.
    2. Evaluate their answer.
    3. Keep the conversation going.
    
    Output Format:
    Raw string as spoken response.
    """
    
    # Determine if we are starting or continuing
    # If payload contains 'interview_topic', it's likely a start/setup request
    # But if there are already messages in history, it might be a continuation.
    
    # We construct the prompt for the LLM using the history
    llm_messages = [{"role": "system", "content": system_prompt}]
    
    # Mapping LangChain/Graph messages to LLM client format
    for msg in messages:
        if isinstance(msg, HumanMessage):
             llm_messages.append({"role": "user", "content": msg.content})
        elif isinstance(msg, AIMessage):
             llm_messages.append({"role": "assistant", "content": msg.content})
        # Handle dicts if state wasn't fully typed with objects?
        elif isinstance(msg, dict):
             llm_messages.append(msg) # Assuming specific format
    
    # If messages are empty, it means we entered this node via a Payload start
    # We need to trigger the opening.
    if not messages and topic:
        # Implicit user intent
        llm_messages.append({"role": "user", "content": f"I am ready for my {topic} interview."})
        
    try:
        response = llm_client.chat_completion(llm_messages)
    except Exception as e:
        print(f"InterviewNode Error: {e}")
        response = "I'm having trouble connecting to the interview server. Please try again."
        
    return {
        # We return the response as a NEW message to be added to state
        "messages": [AIMessage(content=response)],
        "next_node": "end"
    }
