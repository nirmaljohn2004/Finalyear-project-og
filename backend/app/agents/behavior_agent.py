import json
from typing import Dict, Any
from app.agents.base_agent import BaseAgent

class BehaviorAgent(BaseAgent):
    def __init__(self):
        super().__init__("BehaviorAgent")

    def process(self, answers: Dict[str, Any]) -> Dict[str, Any]:
        self.log("Analyzing psychometric data...")
        
        # Construct prompt for LLM
        prompt = f"""
        Analyze the following psychometric test answers and determine the student's profile based on these 5 dimensions:
        1. Learning Preference (e.g., visual, theoretical, practical)
        2. Learning Speed (e.g., slow, moderate, fast)
        3. Difficulty Comfort (e.g., easy, medium, hard, competition)
        4. Feedback Style (e.g., direct, scaffolding, solution-first)
        5. Goal Orientation (e.g., basics, projects, jobs, competition)

        Return ONLY a JSON object with keys: learning_preference, learning_speed, difficulty_comfort, feedback_style, goal_orientation.
        
        Answers: {json.dumps(answers)}
        """
        
        
        full_prompt = f"System: You are an expert educational psychologist.\n\n{prompt}"
        response = self.llm.generate(full_prompt)
        
        try:
            # Clean response to ensure it's just JSON
            if "{" not in response:
                 # Fallback
                 return {
                    "learning_preference": "Practical",
                    "learning_speed": "Moderate",
                    "difficulty_comfort": "Medium",
                    "feedback_style": "Hints",
                    "goal_orientation": "Projects"
                }
            
            # Simple extraction of JSON part
            start = response.find("{")
            end = response.rfind("}") + 1
            json_str = response[start:end]
            data = json.loads(json_str)
            
            # Ensure all keys exist
            defaults = {
                "learning_preference": "Practical",
                "learning_speed": "Moderate",
                "difficulty_comfort": "Medium",
                "feedback_style": "Hints",
                "goal_orientation": "Projects"
            }
            
            return {**defaults, **data}
        except Exception as e:
            self.log(f"Error parsing LLM response: {e}")
            return {
                "learning_preference": "Practical",
                "learning_speed": "Moderate",
                "difficulty_comfort": "Medium",
                "feedback_style": "Hints",
                "goal_orientation": "Projects"
            }
