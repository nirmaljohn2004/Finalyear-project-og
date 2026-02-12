from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.llm import llm_client
import json

router = APIRouter()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            # Simple protocol: Expect JSON {"message": "...", "history": [...]} or just raw text
            # For this MVP, let's assume it sends a JSON string or raw text.
            try:
                payload = json.loads(data)
                user_message = payload.get("message", "")
                history = payload.get("history", [])
            except:
                user_message = data
                history = []

            # Construct messages for LLM
            messages = history + [{"role": "user", "content": user_message}]
            
            # Stream response
            response_text = ""
            stream = llm_client.stream_chat_completion(messages)
            
            for chunk in stream:
                response_text += chunk
                await websocket.send_text(chunk)
            
            # Send a special delimiter or just end the loop for this message?
            # The client needs to know when the turn ends.
            # Let's send a JSON with "done": true or a special char.
            # Simple approach: The client detects silence or we send a final JSON.
            # For voice-to-voice, raw stream is best. We can send a null byte or specific string.
            await websocket.send_text("<<END>>")

    except WebSocketDisconnect:
        print(f"Client #{client_id} disconnected")
