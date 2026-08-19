# AGENTS.md · Guidelines for AI Coding Assistants

Welcome, AI Agent! This file provides essential architectural rules, conventions, and guidelines for navigating and extending this full-stack AI/ML boilerplate.

---

## 🎯 Architecture Summary

1. **Backend (`/backend`)**:
   - **Framework:** FastAPI (ASGI) managed by Uvicorn.
   - **Lifespan (`main.py`):** Loads ML model into memory once, connects database engines, seeds initial admin user, and runs schema migrations/sync.
   - **Engines (`engines/`):** Pluggable database abstractions:
     - `engines/postgresql`: Uses `asyncpg` with a global connection pool `get_pool()`.
     - `engines/mongodb`: Uses `motor.motor_asyncio` client `get_db()`.
   - **Offline Tolerance:** When no `DATABASE_URL` is set, handlers MUST fallback to `LOCAL_PREDICTIONS_CACHE` rather than throwing fatal exceptions.
   - **Active Learning (`router.py` & `verified_dataset.sql`):** Feedback submissions (`POST /api/predictions/{id}/feedback`) update `predictions` and auto-upsert into `verified_predictions`.

2. **Frontend (`/frontend`)**:
   - **Framework:** Next.js 16 (Turbopack, App Router).
   - **Architecture:** 
     - `services/`: Unified `HttpService` using relative `/api/*` routes.
     - `hooks/`: Declarative state machines (`useDigitClassifier`, `useAdmin`).
     - `components/`: Pure UI presentation components.
   - **Proxying:** `next.config.ts` handles rewrites from `/api/*` to `BACKEND_URL` (`http://localhost:8008` in dev).

---

## 📐 Key Design Rules for AI Agents

### Rule 1: Database Operations
- Never call raw drivers directly in routers; always import from `engines.postgresql` or `engines.mongodb`.
- When adding new tables or schema changes, update both:
  1. `backend/main.py` -> `init_postgres_schema()`
  2. `backend/verified_dataset.sql`

### Rule 2: Frontend API Calls
- Do not use absolute URLs (`http://localhost:8008/api/...`) inside frontend services.
- Always use relative endpoints: `http.get('/api/admin/predictions')`. This ensures automatic proxying on Vercel and local dev without CORS errors.

### Rule 3: Authentication & Security
- Admin routes are protected with `admin: Dict[str, Any] = Depends(get_current_admin)`.
- Passwords are salted and hashed with `hashlib.pbkdf2_hmac("sha256", ...)`.
- The default fallback admin credentials are `admin` / `admin123`.

### Rule 4: Machine Learning Inference
- ML models must be pre-loaded at startup in `load_model()` to prevent I/O bottlenecks per inference request.
- Keep preprocessing functions (`preprocess_image()`) pure and deterministic using NumPy/SciPy.
