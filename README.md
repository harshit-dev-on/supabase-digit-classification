# 🚀 Full-Stack AI/ML & Active Learning (Supabase + FastAPI + Next.js 16)

A production-ready, modular architecture for building, serving, and continuously retraining Machine Learning web applications. Built with **Next.js 16 (Turbopack)**, **Supabase BaaS (Auth + PostgreSQL + RLS + Triggers)**, and a lightweight **FastAPI ML Microservice**.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Supabase & Active Learning Pipeline](#-supabase--active-learning-pipeline)
- [Environment Variables](#-environment-variables)
- [Getting Started Locally](#-getting-started-locally)
- [Deployment Guide](#-deployment-guide)

---

## 🏛️ Architectural Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend (with Supabase SDK)              │
│  - 28x28 Canvas Input        - Real-Time Result & Confidence Bar       │
│  - Supabase Auth (GoTrue)    - Admin Gallery & Dataset Export          │
└──────────────────┬──────────────────────────────────┬──────────────────┘
                   │                                  │
      (Inference Request Only)               (Direct Auth & DB)
                   │                                  │
┌──────────────────▼───────────────┐     ┌────────────▼──────────────────┐
│      FastAPI ML Microservice     │     │           Supabase            │
│  - Pure ML inference             │     │  - Managed Auth (GoTrue)      │
│  - Center-of-mass preprocessing  │     │  - PostgreSQL DB & RLS        │
│  - SGD Model Serving (~50 lines) │     │  - Auto-Trigger Dataset Sync  │
└──────────────────────────────────┘     └───────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), TypeScript, [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript/installing) |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/), Python 3.10+, Uvicorn (ASGI) |
| **Machine Learning** | [Scikit-learn](https://scikit-learn.org/), [NumPy](https://numpy.org/), [SciPy](https://scipy.org/), [Joblib](https://joblib.readthedocs.io/) |
| **BaaS Platform** | [Supabase](https://supabase.com/) (PostgreSQL, Built-in Auth, Row Level Security, Triggers) |
| **Deployment** | [Render](https://render.com/) (FastAPI ML Service via `render.yaml`), [Vercel](https://vercel.com/) (Frontend) |

---

## 📂 Project Directory Structure

```text
supabase-digit-classification/
├── render.yaml                          # Infrastructure blueprint for Render
├── README.md                            # Complete Project Documentation
├── AGENTS.md                            # AI Agent Context Guide
├── supabase/
│   └── schema.sql                       # Tables, RLS policies & SQL trigger function
├── backend/
│   ├── main.py                          # FastAPI ML microservice & lifespan
│   ├── requirements.txt                 # ML Python dependencies
│   ├── .env                             # Local backend config (FRONTEND_URL, PORT)
│   ├── .env.template                    # Template backend config
│   └── digit_recognition/               # ML Domain Module
│       ├── router.py                    # Inference & center-of-mass preprocessing
│       ├── test_endpoints.py            # Local automated test script
│       └── models/
│           └── sgd_clf_model.pkl        # Serialized pre-trained ML model
└── frontend/
    ├── app/
    │   ├── layout.tsx                   # Next.js Root layout
    │   ├── page.tsx                     # Main application entry
    │   └── globals.css                  # Modern CSS design system
    ├── components/
    │   ├── DigitClassifier.tsx          # Main composition component
    │   ├── Canvas/
    │   │   └── DigitCanvas.tsx          # Interactive 28x28 drawing canvas
    │   ├── Result/
    │   │   └── PredictionView.tsx       # Result & confidence display
    │   └── Admin/
    │       ├── AdminLoginModal.tsx      # Supabase Auth login dialog
    │       ├── AdminDashboard.tsx       # Dual-tab Gallery & Retraining manager
    │       └── DrawingThumbnail.tsx     # 784-float array to canvas renderer
    ├── hooks/
    │   ├── useDigitClassifier.ts        # Canvas drawing & Supabase logging
    │   └── useAdmin.ts                  # Supabase Auth & verified dataset hook
    ├── services/
    │   ├── http.ts                      # Centralized HTTP request wrapper
    │   ├── digitApi.ts                  # ML prediction API service
    │   └── index.ts                     # Barrel exports
    ├── utils/
    │   └── supabase/
    │       └── client.ts                # Browser Supabase client instance
    ├── .env.local                       # Local frontend environment variables
    ├── .env.local.template              # Template frontend environment variables
    ├── next.config.ts                   # Proxy rewrites (/api/* -> backend ML service)
    └── package.json
```

---

## 🔐 Environment Variables

### 1. Frontend (`frontend/.env.local`)
```env
# Supabase Project Credentials (from Supabase Dashboard -> Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# ML Microservice URL (used by Next.js rewrites)
BACKEND_URL=http://localhost:8008
```

### 2. Backend (`backend/.env`)
```env
# Allowed Frontend Origin for CORS
FRONTEND_URL=http://localhost:3000
PORT=8008
```

---

## 💻 Getting Started Locally

### Step 1: Set Up Supabase Database
1. Go to [supabase.com](https://supabase.com) and create a project.
2. In the **SQL Editor**, paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. In **Authentication -> Users**, create an admin user (e.g. `admin@example.com`).
4. Copy your project credentials to `frontend/.env.local`.

---

### Step 2: Run the Backend ML Microservice
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --port 8008 --reload
```
* Backend API: **http://localhost:8008**
* API Documentation (Swagger): **http://localhost:8008/docs**

---

### Step 3: Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
* Open [**http://localhost:3000**](http://localhost:3000) in your browser.
