from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import research, websocket
from models.research import Base, engine

# Ensure tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(title='Research Assistant API')

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(research.router, prefix='/api')
app.include_router(websocket.router)

@app.get('/health')
async def health():
    return {'status': 'healthy'}
