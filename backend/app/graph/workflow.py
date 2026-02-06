from langgraph.graph import StateGraph, END
from app.core.state import AgentState
from app.graph.nodes.supervisor import supervisor_node
from app.graph.nodes.chat import chat_node
from app.graph.nodes.skill import skill_node
from app.graph.nodes.content import content_node
from app.graph.nodes.evaluator import evaluator_node
from app.graph.nodes.interview import interview_node

# Define the graph
workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("chat", chat_node)
workflow.add_node("skill", skill_node)
workflow.add_node("content", content_node)
workflow.add_node("evaluate", evaluator_node)
workflow.add_node("interview", interview_node)

# Add Edges
# Entry point
workflow.set_entry_point("supervisor")

# Conditional Routing from Supervisor
def route_supervisor(state: AgentState):
    next_node = state.get("next_node", "chat")
    print(f"Graph Routing: supervisor -> {next_node}")
    
    if next_node == "end":
        return END
        
    return next_node

workflow.add_conditional_edges(
    "supervisor",
    route_supervisor,
    {
        "chat": "chat",
        "skill": "skill",
        "content": "content",
        "evaluate": "evaluate",
        "interview": "interview",
        END: END
    }
)

# Standard Edges (Nodes -> END)
# In this simple supervisor pattern, workers finish and return results.
# If we wanted multi-turn reasoning, we'd route back to supervisor.
# For now, we end.
workflow.add_edge("chat", END)
workflow.add_edge("skill", END)
workflow.add_edge("content", END)
workflow.add_edge("evaluate", END)
workflow.add_edge("interview", END)

# Compile
app_graph = workflow.compile()
