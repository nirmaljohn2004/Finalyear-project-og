# Quality Testing Guide

This document outlines how to run the newly created quality testing infrastructure for the EvoCode project.

## 1. Backend API & Logic Tests (Pytest)
We use `pytest` for backend testing. Tests are located in `backend/tests/`.

**To run backend tests:**
```bash
cd backend
# Make sure your virtual environment is active!
# On Windows: .\venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pytest
```
*Tip: To see print statements and detailed output, use `pytest -v -s`.*

## 2. Frontend Component Tests (Vitest)
We use `vitest` and `@testing-library/react` for isolated frontend component checks. Tests are located alongside components or in `frontend/src/`.

**To run frontend tests:**
```bash
cd frontend
npm run test
```
*Note: Vitest runs in watch mode by default. Press `q` to quit, or `u` to update snapshots if you add them later.*

## 3. End-to-End System Tests (Playwright)
We use `playwright` to simulate a real user opening the browser and interacting with both the frontend and backend. Tests are located in `frontend/e2e/`.

**To run E2E system tests:**
```bash
cd frontend
# Note: Ensure both the backend and frontend dev servers are running before executing this!
npm run test:e2e
```
*Tip: Playwright will generate an HTML report. If a test fails, you can run `npx playwright show-report` to view a detailed trace of what happened.*

---
**Summary of additions for QA:**
- Added `backend/requirements-dev.txt` for backend test dependencies.
- Converted `health_check.py` to `test_health.py` as an initial Pytest suite.
- Installed `vitest` and `@testing-library/react` in the frontend along with a basic `App.test.jsx`.
- Installed `@playwright/test` and `chromium` in the frontend along with a basic `example.spec.js`.
