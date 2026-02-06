from typing import Dict, Any, List
from app.core.state import AgentState
from app.core.llm import llm_client
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

def chat_node(state: AgentState) -> Dict[str, Any]:
    """
    General Chat Tutor.
    """
    print("--- CHAT NODE ---")
    
    messages = state.get("messages", [])
    user_profile = state.get("user_profile", {})
    
    # Construct System Context from Profile
    profile_context = f"""
    Interact with the student based on their profile:
    - Learning Preference: {user_profile.get('learning_preference', 'Practical')}
    - Learning Speed: {user_profile.get('learning_speed', 'Moderate')}
    - Difficulty Comfort: {user_profile.get('difficulty_comfort', 'Medium')}
    - Feedback Style: {user_profile.get('feedback_style', 'Hints')}
    - Goal Orientation: {user_profile.get('goal_orientation', 'Projects')}
    """
    
    system_prompt = f"""
    You are an AI Tutor on an educational platform.
    {profile_context}
    
    Answer the student's questions clearly and helpfully.
    If they ask for code, provide it.
    If they are stuck, give hints.
    """
    
    llm_messages = [{"role": "system", "content": system_prompt}]
    
    # Convert history
    for msg in messages:
        if isinstance(msg, HumanMessage):
             llm_messages.append({"role": "user", "content": msg.content})
        elif isinstance(msg, AIMessage):
             llm_messages.append({"role": "assistant", "content": msg.content})
        elif isinstance(msg, dict):
             llm_messages.append(msg)

    try:
        response_text = llm_client.chat_completion(llm_messages)
    except Exception as e:
        print(f"ChatNode Error: {e}")
        response_text = "I'm having trouble thinking right now. Please try again."

    return {
        "messages": [AIMessage(content=response_text)],
        "next_node": "end"
    }
