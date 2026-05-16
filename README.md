# Multi-Agent Research Assistant

A full-stack AI research assistant built with React, FastAPI, and LangGraph. It uses Groq's API for fast LLM inference with three specialized agents orchestrated by LangGraph.

## Quick Setup

### 1. Get Groq API Key
1. Go to: https://console.groq.com
2. Sign up and create an API key
3. Copy the key and put it in `backend/.env` as `GROQ_API_KEY=your_key_here`

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open Application
Open [http://localhost:5173](http://localhost:5173) in your browser.
