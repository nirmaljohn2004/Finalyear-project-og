from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from pydantic import BaseModel

class InterviewContext(BaseModel):
    topic: str
    difficulty: str
    history: List[Dict[str, str]] = []

class InterviewAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="InterviewAgent")
        self.system_prompt = """
        You are an expert Technical Interviewer for a top-tier tech company.
        Your goal is to conduct a realistic mock interview.
        alway make your response concise and short.
        
        Personality:
        - Professional, polite, but rigorous.
        - You value clear communication and problem-solving skills.
        - You don't just accept answers; you ask "why" and "how".
        
        Process:
        1. Start by welcoming the candidate and asking a question relevant to the chosen topic and difficulty.
        2. Wait for their answer.
        3. Evaluate their answer:
           - If correct: Acknowledge it briefly and move to a slightly harder follow-up or a new related concept.
           - If incorrect or incomplete: Provide a hint or ask a guiding question without giving the answer away immediately. Only explain fully if they fail twice.
        4. Keep the conversation going like a real interview.
        
        Output Format:
        You must return a raw string that acts as your spoken response to the candidate. 
        Do not output JSON unless explicitly asked. Just talk to them.
        """

    def process(self, input_data: Any) -> Dict[str, Any]:
        # Not used heavily here, we prefer specific methods
        pass

    def start_interview(self, topic: str, difficulty: str) -> str:
        prompt = f"""
        User wants to practice: {topic}
        Difficulty Level: {difficulty}
        
        Start the interview now. Introduce yourself briefly and ask the first question.
        """
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        return self.llm.chat_completion(messages)

    def chat(self, context: InterviewContext, user_message: str) -> str:
        # Construct message history for context
        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add a summary of context if history is empty (first turn after start)
        if not context.history:
             messages.append({"role": "user", "content": f"Topic: {context.topic}, Level: {context.difficulty}. (Previous context implied)"})
        
        # Replay history
        for msg in context.history:
            messages.append(msg)
            
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        response = self.llm.chat_completion(messages)
        return response
