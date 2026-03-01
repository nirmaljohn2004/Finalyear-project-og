import asyncio
from app.graph.workflow import app_graph
from langchain_core.messages import HumanMessage

def test_graph():
    print("Testing the full app_graph execution locally...")
    
    initial_state = {
        "messages": [HumanMessage(content="Hello AI. How are you?")],
        "user_profile": {"learning_preference": "Practical"},
        "user_email": "test@demo.com",
        "payload": {}
    }
    
    try:
        result = app_graph.invoke(initial_state)
        print("\n=== GRAPH RESULT ===")
        print(f"Next Node: {result.get('next_node')}")
        msgs = result.get('messages', [])
        if msgs:
            print(f"Output Message: {msgs[-1].content}")
        else:
            print("No output messages!")
    except Exception as e:
        print(f"\nCRITICAL GRAPH ERROR: {e}")

if __name__ == "__main__":
    test_graph()
