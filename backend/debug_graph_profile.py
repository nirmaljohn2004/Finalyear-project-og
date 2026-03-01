import asyncio
from app.graph.workflow import app_graph
from langchain_core.messages import HumanMessage

def test_graph_with_profile():
    print("Testing app_graph with filled profile...")
    
    # Simulating what we see in `debug_endpoint.py` and `app/core/llm.py`
    # When `user_profile` comes from DB, it has nested dictionaries
    initial_state = {
        "messages": [HumanMessage(content="Hello AI. Explain python variables.")],
        "user_profile": {
             "learning_preference": "Practical",
             "learning_speed": "Moderate",
             "difficulty_comfort": "Medium",
             "feedback_style": "Hints",
             "goal_orientation": "Projects"
        },
        "user_email": "test@demo.com",
        "payload": {}
    }
    
    try:
        result = app_graph.invoke(initial_state)
        print("\n=== GRAPH RESULT ===")
        msgs = result.get('messages', [])
        if msgs:
            print(f"Output Message: {msgs[-1].content}")
        else:
            print("No output messages!")
    except Exception as e:
        print(f"\nCRITICAL GRAPH ERROR: {e}")

if __name__ == "__main__":
    test_graph_with_profile()
