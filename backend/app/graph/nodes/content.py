from typing import Dict, Any
from app.core.state import AgentState
from app.core.llm import llm_client

def content_node(state: AgentState) -> Dict[str, Any]:
    """
    Generates personalized learning content (markdown lesson).
    """
    print("--- CONTENT NODE ---")
    
    payload = state.get("payload", {})
    user_profile = state.get("user_profile", {})
    
    topic = payload.get("topic_id", "Unknown Topic")
    language = payload.get("language", "Python")
    level = payload.get("level", "Intermediate")
    
    # Extract profile tags with defaults
    learning_preference = user_profile.get('learning_preference', 'Practical') 
    learning_speed = user_profile.get('learning_speed', 'Moderate')
    difficulty_comfort = user_profile.get('difficulty_comfort', 'Medium')
    feedback_style = user_profile.get('feedback_style', 'Hints')

    # [RAG INTEGRATION]
    # Fetch relevant curriculum content from ChromaDB
    rag_context = ""
    try:
        from app.core.rag import rag_system
        # Query using the topic title + language
        query = f"{topic} in {language}"
        rag_context = rag_system.query_context(query, n_results=3)
        print(f"DEBUG: Content RAG Context: {len(rag_context)} chars")
    except Exception as e:
        print(f"WARNING: RAG Query Failed: {e}")

    prompt = f"""
    You are an expert programming tutor.
    The student is struggling with the topic: "{topic}" in {language} ({level} level).
    
    **Student Profile:**
    - **Learning Style:** {learning_preference} (Tailor explanations accordingly)
    - **Pace:** {learning_speed}
    - **Preferred Difficulty:** {difficulty_comfort}
    - **Feedback Preference:** {feedback_style}
    
    **Official Course Curriculum (Use this as the source of truth):**
    {rag_context}
    
    Generate a concise but comprehensive lesson to help them master this concept.
    
    Structure your response in Markdown with the following sections:
    1. **Concept Simplified**: A very clear explanation tailored to their {learning_preference} style. Use **Markdown Tables** for any structured data or comparisons.
    2. **Common Pitfalls**: What mistakes do beginners usually make here?
    3. **Code Example**: A clear, commented code snippet demonstrating the concept.
    4. **Key Takeaway**: One sentence summary to remember.
    
    Do not include any preamble or postscript. Return only the Markdown content.
    """
    
    content = ""
    try:
        content_raw = llm_client.generate(prompt)
        content_stripped = content_raw.strip()
        
        # Remove markdown fences logic
        if content_stripped.startswith("```markdown"):
            content_stripped = content_stripped[11:]
            if content_stripped.endswith("```"):
                content_stripped = content_stripped[:-3]
        elif content_stripped.startswith("```"):
            content_stripped = content_stripped[3:]
            if content_stripped.endswith("```"):
                content_stripped = content_stripped[:-3]
                
        content = content_stripped.strip()
        
    except Exception as e:
        print(f"ContentNode Error: {e}")
        if "AI_QUOTA_EXCEEDED" in str(e):
             content = "AI_QUOTA_EXCEEDED" # Signal to API to handle
        else:
             content = f"Error generating content: {e}"

    return {
        "payload": {"content": content},
        "next_node": "end"
    }
