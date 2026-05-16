<div align="center">
  <img src="https://img.shields.io/badge/LangGraph-Agentic_AI-8A2BE2?style=for-the-badge&logo=openai" alt="LangGraph AI" />
  <img src="https://img.shields.io/badge/React_18-Frontend-61DAFB?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Groq-LLM_Inference-F55036?style=for-the-badge" alt="Groq AI" />
  <br />
  
  <h1>🧠 Multi-Agent Research Assistant</h1>
  <p><strong>An Enterprise-Grade, Autonomous AI Research Platform</strong></p>
</div>

---

## 📖 Overview

The **Multi-Agent Research Assistant** is a high-performance, autonomous AI platform designed to automate deep-dive research tasks. Leveraging **LangGraph** for multi-agent orchestration and the **Groq API** for ultra-low latency LLM inference, the system breaks down complex queries, scours the web using asynchronous web scraping, processes context via a true **RAG (Retrieval-Augmented Generation)** pipeline, and synthesizes comprehensive, deeply-cited intelligence reports in real-time.

Designed with a stunning 2026-era Glassmorphism UI, interactive particle backgrounds, and real-time WebSocket state streaming, this platform feels like a true next-generation AI SaaS application.

---

## ✨ Features & Capabilities

- **🤖 Multi-Agent Orchestration**: Specialized agents (Planner, Searcher, Synthesizer) coordinate seamlessly using LangGraph.
- **⚡ Ultra-Fast Inference**: Powered by `llama-3.3-70b-versatile` via the Groq API.
- **🔍 True RAG Pipeline**: Asynchronous HTML scraping, Chunking, `all-MiniLM-L6-v2` embeddings, and FAISS Vector Search.
- **📡 Real-Time WebSockets**: Live progress updates and neural graph execution states streamed directly to the frontend.
- **💾 Multi-Format Export**: Generate and download robust intelligence reports in **PDF, DOCX, and Markdown**.
- **🎨 Premium UI/UX**: Built with Framer Motion, TailwindCSS v3, glass paneling, and an interactive particle neural network.
- **🛡️ Production-Ready**: Thread-safe SQLAlchemy handling, error propagation, and rate-limit mitigation built-in.

---

## 📸 System Screenshots

### System Dashboard & Input
> *Placeholder for System Dashboard Screenshot*
![System Dashboard](https://via.placeholder.com/1000x500.png?text=System+Dashboard+Screenshot)

### AI Workflow & Intelligence Synthesis
> *Placeholder for AI Workflow / Analytics Screenshot*
![AI Workflow](https://via.placeholder.com/1000x500.png?text=AI+Workflow+%2F+Analytics+Screenshot)

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 18 (TypeScript) + Vite
- **Styling:** Tailwind CSS v3, Glassmorphism 
- **Animations:** Framer Motion, React-TSParticles
- **State & Realtime:** Zustand, Socket.io-client, native WebSockets
- **Exporting:** html2pdf.js, file-saver

### **Backend**
- **Framework:** FastAPI (Python)
- **Agent Framework:** LangGraph
- **Database:** SQLite (SQLAlchemy ORM with `asyncio.to_thread` optimizations)
- **Realtime:** FastAPI WebSockets

### **AI / ML / RAG**
- **LLM API:** Groq (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`)
- **Embeddings:** SentenceTransformers (`all-MiniLM-L6-v2`)
- **Vector Store:** FAISS (Facebook AI Similarity Search)
- **Web Search:** DuckDuckGo Search API + BeautifulSoup4 (Async)

---

## 🏗️ System Architecture Overview

1. **User Request**: The React frontend sends a query via REST API. A WebSocket connection is established to track the job ID.
2. **Planner Agent**: Decomposes the master query into strategic sub-questions.
3. **Search Agent (RAG)**: Uses DuckDuckGo to find URLs, asynchronously fetches the raw HTML via `aiohttp`, extracts text, chunks it, embeds it into FAISS, and retrieves the top-K highly semantic vectors.
4. **Synthesizer Agent**: Compiles the embedded RAG context and the initial query to draft a heavily detailed, markdown-formatted report.
5. **Real-time Delivery**: Progress is pushed to the UI via WebSockets. Once complete, the Markdown report is rendered with native PDF/DOCX export options.

---

## 🚀 Installation and Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- A valid [Groq API Key](https://console.groq.com) (100% Free)

### 1. Environment Variables Setup
Create a `.env` file in the `backend/` directory:
```env
# backend/.env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```

Application will be running at [http://localhost:5173](http://localhost:5173)

---

## 🐳 Docker Setup (Optional)
*A `docker-compose.yml` is planned for the next release to orchestrate the FastAPI backend, React frontend, and a PostgreSQL instance simultaneously.*

---

## 📚 API Documentation
Once the backend is running, navigate to the auto-generated Swagger UI:
- **Swagger Docs:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Core Endpoints
- `POST /api/research` - Submits a new research query, returns a `job_id`.
- `GET /api/research/{job_id}` - Polls the current state of a research job.
- `WS /ws/{job_id}` - Upgrades to a WebSocket connection for live agent updates.

---

## 📂 Folder Structure

```text
Multi-Agent Research Assistant/
│
├── backend/
│   ├── agents/         # Planner, Searcher, and Synthesizer Agents
│   ├── api/            # FastAPI REST Routes & WebSockets
│   ├── models/         # SQLAlchemy DB Models
│   ├── rag/            # FAISS VectorStore & SentenceTransformers Embeddings
│   ├── workflow/       # LangGraph State Graph definitions
│   ├── main.py         # FastAPI Entrypoint
│   └── llm_service.py  # Groq API Integration wrapper
│
└── frontend/
    ├── src/
    │   ├── components/ # React UI (ReportDisplay, ParticleBackground, etc.)
    │   ├── hooks/      # useWebSocket hook
    │   ├── services/   # Axios API integrations
    │   ├── store/      # Zustand Global State
    │   └── App.tsx     # Main Layout
    ├── tailwind.config.js
    └── index.html
```

---

## 🧪 Testing Instructions
1. Run the FastAPI backend using `uvicorn`.
2. Run the React frontend using `npm run dev`.
3. Submit a complex query (e.g., *"What are the economic implications of AGI by 2030?"*).
4. Verify the animated progress indicators show agent hand-offs.
5. Once completed, test the **Export PDF** and **Export DOCX** functionalities.

---

## 🔮 Future Improvements
- [ ] Migrate SQLite to **PostgreSQL** with `asyncpg` for high concurrency.
- [ ] Implement **Celery/Redis** task queues to preserve background jobs on server restart.
- [ ] Add **Auth0 / JWT authentication** for user accounts and historical job saving.
- [ ] Containerize the full stack via **Docker**.

---

## 🤝 Contribution Guidelines
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 📬 Contact Information
**Rohit**  
GitHub: [@kolirolly](https://github.com/kolirolly)  
Project Link: [https://github.com/kolirolly/Multi-agent-research-assistant](https://github.com/kolirolly/Multi-agent-research-assistant)
