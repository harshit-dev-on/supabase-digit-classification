# AGENTS.md · Guidelines for AI Coding Assistants

Welcome, AI Agent! This file provides essential architectural rules, conventions, and guidelines for navigating and extending this Next.js 16 + Supabase application.

---

## 🎯 Architecture Summary

1. **Frontend (`/`)**:
   - **Framework:** Next.js 16 (Turbopack, App Router), React 19, TypeScript.
   - **BaaS Layer:** Supabase (`@supabase/supabase-js`) handles Auth (GoTrue), PostgreSQL persistence, Row Level Security (RLS), and database triggers.
   - **Architecture:** 
     - `services/`: Unified `digitApi` using relative `/api/*` routes.
     - `hooks/`: Declarative state machines (`useDigitClassifier`, `useAdmin`).
     - `components/`: Pure UI presentation components (`Canvas/`, `Result/`, `Admin/`).
     - `utils/supabase/`: Client singleton initialization.
   - **Proxying:** `next.config.ts` handles rewrites from `/api/*` to `ML_SERVICE_URL` (`http://localhost:8008` in dev, or Render in prod).

2. **Decoupled ML Microservice (External Repo: `digit-classification-ml-api`)**:
   - Standalone FastAPI Python service for MNIST 28x28 Scikit-Learn inference.
   - Preprocessing with SciPy center-of-mass alignment.

---

## 📐 Key Design Rules for AI Agents

### Rule 1: Database Operations
- All database queries and auth operations must use `supabase` from `@/utils/supabase/client`.
- Tables and RLS policies are documented in `supabase/schema.sql`.

### Rule 2: Frontend API Calls
- Do not use absolute URLs (`http://localhost:8008/api/...`) inside frontend components or services.
- Always use relative endpoints: `digitApi.predict(pixels)` -> `http.post('/api/predict', ...)`.
- Next.js rewrites proxy `/api/*` to `ML_SERVICE_URL`.
