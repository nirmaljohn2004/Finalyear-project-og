from abc import ABC, abstractmethod
from typing import Any, Dict
from app.core.llm import llm_client

class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name
        self.llm = llm_client

    @abstractmethod
    def process(self, input_data: Any) -> Dict[str, Any]:
        """
        Process the input data and return the result.
        """
        pass

    def log(self, message: str):
        print(f"[{self.name}] {message}")
