from typing import Dict, Any
from app.agents.base_agent import BaseAgent

class ContentAgent(BaseAgent):
    def __init__(self):
        super().__init__("ContentAgent")

    def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        topic = context.get("topic")
        profile = context.get("profile", {})
        
        self.log(f"Generating content for topic: {topic}")
        
        prompt = f"""
        Generate a personalized explanation, code example, and practice problem for the topic: {topic}.
        Adapt to the following student profile:
        - Learning Preference: {profile.get('learning_preference', 'Practical')}
        - Learning Speed: {profile.get('learning_speed', 'Moderate')}
        - Difficulty Comfort: {profile.get('difficulty_comfort', 'Medium')}
        - Feedback Style: {profile.get('feedback_style', 'Hints')}
        - Goal Orientation: {profile.get('goal_orientation', 'Projects')}
        
        Return ONLY a JSON object with keys: explanation, code_example, practice_problem.
        """
        
        response_text = self.llm.generate(prompt)
        
        try:
            # Clean up potential markdown code blocks if the LLM wraps JSON
            cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
            import json
            data = json.loads(cleaned_text)
            return data
        except Exception as e:
            self.log(f"Error parsing JSON from LLM: {e}")
            return {
                "explanation": "Could not generate content at this time. (JSON Parse Error)",
                "code_example": "# Error",
                "practice_problem": "Please try again."
            }
