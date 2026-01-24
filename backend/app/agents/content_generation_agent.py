from app.agents.base_agent import BaseAgent
from typing import Dict, Any
import json

class ContentGenerationAgent(BaseAgent):
    def __init__(self):
        super().__init__("ContentGenerationAgent")

    def process(self, input_data: Dict[str, Any]) -> str:
        """
        Implementation of abstract process method.
        Expects input_data to contain 'topic', 'language', 'level', and optional 'user_profile'.
        """
        topic = input_data.get("topic")
        language = input_data.get("language")
        level = input_data.get("level")
        user_profile = input_data.get("user_profile", {})
        return self.generate_content(topic, language, level, user_profile)

    def generate_content(self, topic: str, language: str, level: str, user_profile: Dict[str, Any] = {}) -> str:
        """
        Generates personalized learning content for a WEAK topic.
        """
        self.log(f"Generating content for {topic} ({language} - {level})...")

        # Extract profile tags with defaults
        learning_preference = user_profile.get('learning_preference', 'Practical') # e.g., Theoretical, Practical
        learning_speed = user_profile.get('learning_speed', 'Moderate')
        difficulty_comfort = user_profile.get('difficulty_comfort', 'Medium')
        feedback_style = user_profile.get('feedback_style', 'Hints')

        prompt = f"""
        You are an expert programming tutor.
        The student is struggling with the topic: "{topic}" in {language} ({level} level).
        
        **Student Profile:**
        - **Learning Style:** {learning_preference} (Tailor explanations accordingly)
        - **Pace:** {learning_speed}
        - **Preferred Difficulty:** {difficulty_comfort}
        - **Feedback Preference:** {feedback_style}
        
        Generate a concise but comprehensive lesson to help them master this concept.
        
        Structure your response in Markdown with the following sections:
        1. **Concept Simplified**: A very clear explanation tailored to their {learning_preference} style. Use **Markdown Tables** for any structured data or comparisons.
        2. **Common Pitfalls**: What mistakes do beginners usually make here?
        3. **Code Example**: A clear, commented code snippet demonstrating the concept.
        4. **Key Takeaway**: One sentence summary to remember.
        
        Do not include any preamble or postscript. Return only the Markdown content.
        """
        
        try:
            content = self.llm.generate(prompt)
            content = content.strip()
            
            # Smartly remove outer markdown wrappers only
            if content.startswith("```markdown"):
                content = content[11:] # Remove ```markdown
                if content.endswith("```"):
                    content = content[:-3] # Remove trailing ```
            elif content.startswith("```"):
                content = content[3:] # Remove ```
                if content.endswith("```"):
                    content = content[:-3] # Remove trailing ```
            
            return content.strip()

        except Exception as e:
            error_str = str(e)
            if "AI_QUOTA_EXCEEDED" in error_str:
                 raise e
            
            self.log(f"Error generating content: {e}")
            return f"Error generating personalized content for {topic}. Please try again later."
