from typing import Dict, Any
from app.agents.base_agent import BaseAgent

class SyllabusGeneratorAgent(BaseAgent):
    def __init__(self):
        super().__init__("SyllabusGeneratorAgent")

    def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        priority_queue = data.get("priority_queue", [])
        
        self.log("Generating customized syllabus...")
        
        # Simple logic: order by priority
        # In reality, would use dependencies graph
        
        return {
            "ordered_topics": priority_queue,
            "next_topic_index": 0
        }
