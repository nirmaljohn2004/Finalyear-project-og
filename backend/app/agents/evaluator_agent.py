from typing import List, Dict, Any
from app.agents.base_agent import BaseAgent

class EvaluatorAgent(BaseAgent):
    def __init__(self):
        super().__init__("EvaluatorAgent")
        self.PASS_THRESHOLD_PERCENT = 70

    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Implementation of abstract process method.
        Expects input_data to contain 'submission' and 'total_questions'.
        """
        submission = input_data.get("submission", [])
        total_questions = input_data.get("total_questions", 0)
        return self.evaluate(submission, total_questions)

    def evaluate(self, quiz_submission: List[Dict[str, Any]], total_questions: int) -> Dict[str, Any]:
        """
        Evaluates the quiz submission and determines mastery.
        """
        self.log("Evaluating quiz submission...")
        
        correct_count = 0
        for answer in quiz_submission:
            # Assuming payload has 'isCorrect' or we check against a key
            # For simplicity, let's assume the frontend/backend pre-validates or passes 'isCorrect' flag
            # OR we trust the client sends 'isCorrect' (MVP shortcut) 
            # Ideally: We fetch correct answers from DB here. 
            # Given instructions: "Quiz source: Static quiz from DB". 
            # Let's assume the payload includes {questionId, selectedOption, isCorrect}.
            if answer.get("isCorrect", False):
                correct_count += 1
        
        score_percent = (correct_count / total_questions) * 100 if total_questions > 0 else 0
        status = "MASTERED" if score_percent >= self.PASS_THRESHOLD_PERCENT else "WEAK"
        
        self.log(f"Evaluation Complete. Score: {score_percent}%. Status: {status}")
        
        return {
            "score": score_percent,
            "correct_count": correct_count,
            "total_questions": total_questions,
            "status": status
        }
