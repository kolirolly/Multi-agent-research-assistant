from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, job_id: str):
        await websocket.accept()
        self.active_connections[job_id] = websocket

    def disconnect(self, job_id: str):
        if job_id in self.active_connections:
            del self.active_connections[job_id]

    async def send_message(self, job_id: str, message: dict):
        if job_id in self.active_connections:
            try:
                await self.active_connections[job_id].send_text(json.dumps(message))
            except Exception as e:
                print(f"Error sending message to ws: {e}")

manager = ConnectionManager()

@router.websocket("/ws/{job_id}")
async def websocket_endpoint(websocket: WebSocket, job_id: str):
    await manager.connect(websocket, job_id)
    try:
        while True:
            # We just keep connection open
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(job_id)
    except Exception as e:
        print(f"WebSocket Error: {e}")
        manager.disconnect(job_id)
