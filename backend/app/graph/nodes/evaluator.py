from typing import Dict, Any, List
from app.core.state import AgentState

def evaluator_node(state: AgentState) -> Dict[str, Any]:
    """
    Evaluates quiz submissions.
    """
    print("--- EVALUATOR NODE ---")
    
    payload = state.get("payload", {})
    submission = payload.get("submission", [])
    total_questions = payload.get("total_questions", 0)
    
    # Logic copied from EvaluatorAgent
    # Trusting 'isCorrect' flag for MVP as per original agent logic
    correct_count = 0
    for answer in submission:
        if answer.get("isCorrect", False):
            correct_count += 1
            
    # Calculate score
    if total_questions > 0:
        score_percent = (correct_count / total_questions) * 100 
    else:
        score_percent = 0
        
    status = "MASTERED" if score_percent >= 70 else "WEAK"
    
    result = {
        "score": score_percent,
        "correct_count": correct_count,
        "total_questions": total_questions,
        "status": status,
        "feedback": f"You scored {score_percent:.1f}%. Status: {status}"
    }
    
    return {
        "payload": result,
        "next_node": "end"
    }
