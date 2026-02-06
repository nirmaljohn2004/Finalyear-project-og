from typing import TypedDict, Annotated, List, Dict, Any, Union
from langgraph.graph.message import add_messages
from langchain_core.messages import AnyMessage

class AgentState(TypedDict):
    """
    The state of the agent graph.
    """
    # The chat history (list of BaseMessage)
    # add_messages is a reducer that appends new messages to the list
    messages: Annotated[List[AnyMessage], add_messages]
    
    # User Context (fetched from DB at start)
    user_profile: Dict[str, Any]
    user_email: str
    
    # Task Routing
    next_node: str         # "chat", "skill", "content", "evaluate", "interview", "end"
    
    # Task Payload (flexible data for specific agents)
    # e.g., for SkillNode: {"quiz_results": [...], "available_topics": [...]}
    # e.g., for ContentNode: {"topic_id": "vars", "language": "python"}
    payload: Dict[str, Any]
