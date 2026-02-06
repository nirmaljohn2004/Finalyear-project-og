from typing import Dict, Any, List
import json
from app.core.state import AgentState
from app.core.llm import llm_client

def skill_node(state: AgentState) -> Dict[str, Any]:
    """
    Analyzes quiz results to generate a personalized learning path (syllabus).
    """
    print("--- SKILL NODE ---")
    
    payload = state.get("payload", {})
    # Extract inputs using keys expected from the API request
    quiz_results = payload.get("quiz_results", [])
    available_topics = payload.get("available_topics", []) # List of dicts or strings?
    
    # Pre-processing: If available_topics contains dicts, extract titles for LLM
    topic_titles = []
    if available_topics and isinstance(available_topics[0], dict):
        topic_titles = [t.get("title", "") for t in available_topics]
    else:
        topic_titles = available_topics

    prompt = f"""
    You are an expert educational AI. 
    Analyze the following quiz answers and the list of available topics.
    Identify the user's weak areas based on incorrect answers.
    Return the 'available_topics' list reordered such that the WEAKEST topics (needing most attention) come FIRST.
    Do not add or remove any topics.
    
    Quiz Results (Question, Answer, Correctness):
    {json.dumps(quiz_results)}
    
    Available Topics:
    {json.dumps(topic_titles)}
    
    Return ONLY a JSON array of strings representing the reordered topics.
    """
    
    ordered_topics = topic_titles # Default fallback
    
    try:
        response_text = llm_client.generate(prompt)
        # Clean response
        cleaned_response = response_text.replace("```json", "").replace("```", "").strip()
        ordered_topics = json.loads(cleaned_response)
        
        # Validation
        if not isinstance(ordered_topics, list):
            print("SkillNode Warning: LLM returned non-list. Fallback to default.")
            ordered_topics = topic_titles
            
    except Exception as e:
        print(f"SkillNode Error: {e}")
        # Fallback: reverse logic or keep same
        if topic_titles:
             ordered_topics = list(reversed(topic_titles))
             
    # Prepare output payload
    # logic to re-attach original objects if we had dicts logic is handled in API layer usually, 
    # but let's just return the ordered list for the API to process.
    
    return {
        "payload": {"ordered_titles": ordered_topics},
        "next_node": "end"
    }
