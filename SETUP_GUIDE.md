# Project Setup Guide

This guide will help you set up the EvoCode project on your local machine.

## Prerequisites

Ensure you have the following installed:
- **Git**: [Download Git](https://git-scm.com/downloads)
- **Python (3.10 or higher)**: [Download Python](https://www.python.org/downloads/)
- **Node.js (v18 or higher)**: [Download Node.js](https://nodejs.org/) (LTS version recommended)
- **Visual Studio Code (optional but recommended)**: [Download VS Code](https://code.visualstudio.com/)

---

## 1. Clone the Repository

Open a terminal (Command Prompt, PowerShell, or Git Bash) and run:

```bash
git clone <repository-url>
cd antigravity-4
```
*(Replace `<repository-url>` with the actual URL of the repository)*

---

## 2. Backend Setup

The backend is built with FastAPI and Python.

### Step 2.1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2.2: Create a Virtual Environment
It's best practice to use a virtual environment to manage dependencies.

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```
*You should see `(venv)` appear at the start of your terminal line.*

### Step 2.3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2.4: Configure Environment Variables
1. Create a file named `.env` in the `backend` folder.
2. Add the following content to it:

```ini
# Core
PROJECT_NAME=EvoCode
ENV=dev

# AI Keys (Required for Chat features)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase / Firestore
FIRESTORE_PROJECT_ID=demo-project
FIREBASE_CREDENTIALS_PATH=serviceAccountKey.json

# Security
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```
*Replace `your_gemini_api_key_here` with a valid Google Gemini API Key.*

### Step 2.5: Firebase Credentials (CRITICAL)
> [!IMPORTANT]  
> The backend **will not start or verify users** without this file.

1. **Ask the project owner** for the `serviceAccountKey.json` file.
2. Place it directly inside the `backend` folder.
3. Ensure the filename matches `FIREBASE_CREDENTIALS_PATH` in your `.env`.

### Step 2.6: Seed the Database (Populate Content)
Since this is a fresh install, your database is likely empty. Run this script to populate the learning topics:

```bash
python scripts/seed_db.py
```
*If this fails, ensure your `serviceAccountKey.json` is correct.*

### Step 2.7: Run the Backend
```bash
uvicorn app.main:app --reload
```
The backend will start at `http://localhost:8000`. You should see `Application startup complete`.

---

## 3. Frontend Setup

The frontend is built with React and Vite.

### Step 3.1: Navigate to Frontend Directory
Open a **new terminal** window (keep the backend running in the first one).

```bash
cd frontend
```

### Step 3.2: Install Dependencies
```bash
npm install
```

### Step 3.3: Run the Frontend
```bash
npm run dev
```
The frontend will start (usually at `http://localhost:5173`). Open this link in your browser.

---

## 4. Troubleshooting

- **"Failed to load topic content" Error**:
  - Run the `python scripts/seed_db.py` script.
  - Verify `serviceAccountKey.json` is present and valid.

- **401 Unauthorized / Login Failed**:
  - Check that `serviceAccountKey.json` belongs to the same Firebase project as the frontend config.
  - Ensure the backend is running.

- **Backend not starting?**
  - Ensure you activated the virtual environment (`venv`).
  - Check if `requirements.txt` installed successfully.
  - Verify `.env` file exists and has valid keys.

- **Frontend API errors?**
  - Ensure the backend is running on `localhost:8000`.
  - Check browser console (F12) for network errors.

- **"Resumable" Badge Not Showing?**
  - The badge only appears if you have a generated learning path in the database.
  - Try starting the quiz for that level to generate the path.
  - If it persists, try logging out and logging back in to refresh your session.

- **401 Unauthorized during Quiz Submission**:
  - Your session token may have expired. Logout and Login again.

---

## 5. Architecture Overview (New)

### Multi-Agent System (LangGraph)
This project uses a graph-based AI architecture located in `backend/app/graph/`.
- **Supervisor**: Routes requests based on intent.
- **Skill Agent**: Reorders topics based on quiz performance.
- **Content Agent**: Generates lessons adapted to your psychometric profile.

### Certificate Generation
Certificates are generated as PDFs using `reportlab`.
- Ensure `reportlab` is installed (`pip install reportlab`).
- Certificates require at least "Attempting" the course (Strict 100% mastery check is currently relaxed for testing).
