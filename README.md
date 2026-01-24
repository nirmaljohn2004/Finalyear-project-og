# AI-Based Personalized Programming Learning Platform

This project is a local-first, full-stack AI-powered learning platform using React, FastAPI, and Agentic AI.

## Prerequisites

- Docker Desktop
- Python 3.9+
- Node.js 18+

## Setup

1. **Clone the repository** (if not already done).

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the services**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Firestore Emulator: [http://localhost:4000](http://localhost:4000) (if UI is enabled)

## Development

- **Backend**: source code is mapped to `./backend`. Changes auto-reload.
- **Frontend**: source code is mapped to `./frontend`. Changes auto-reload.

## Architecture

- **Frontend**: React (UI)
- **Backend**: FastAPI (API, Agent Orchestration)
- **Database**: Firestore Emulator (NoSQL)
- **Agents**: Python-based AI agents using LangGraph/LLMs.

## Running Manually (Without Docker)

If Docker is not available, you can run the services individually:

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Firestore
You will need to run the Firestore emulator or use a mock.
For now, the backend will fail to connect if Emulator isn't running, but you can test UI flows.

