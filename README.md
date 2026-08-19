# 🎨 Handwritten Digit Classification Studio (Next.js 16 + Supabase)

A production-ready web application for drawing handwritten digits, serving real-time predictions from a decoupled ML inference microservice, and curating an **Active Learning ground-truth training dataset** with **Supabase**.

---

## 🏛️ System Architecture (Decoupled Microservice)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend (This Repository)                │
│  - 28x28 Pixel Drawing Canvas  - Confidence & Softmax Probability View │
│  - Supabase Auth (GoTrue)      - Ground-Truth Active Learning Manager  │
└──────────────────┬──────────────────────────────────┬──────────────────┘
                   │                                  │
      (Inference Request Only)               (Direct Auth & DB)
                   │                                  │
┌──────────────────▼───────────────┐     ┌────────────▼──────────────────┐
│   ML Microservice (Render/Modal) │     │           Supabase            │
│  - Standalone FastAPI API repo   │     │  - Managed Auth (GoTrue)      │
│  - Scipy center-of-mass shift    │     │  - PostgreSQL DB & RLS        │
│  - Model inference (~50 LOC)     │     │  - Auto-Trigger Dataset Sync  │
└──────────────────────────────────┘     └───────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), TypeScript |
| **BaaS / Database** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Triggers, GoTrue Auth) |
| **ML Inference** | External FastAPI Microservice ([`digit-classification-ml-api`](https://github.com/)) |
| **Deployment** | [Vercel](https://vercel.com/) (Zero-config Next.js root deployment) |

---

## 📂 Project Structure

```text
supabase-digit-classification/
├── app/                                 # Next.js App Router
│   ├── layout.tsx                       # Root layout & Google Fonts
│   ├── page.tsx                         # Main digit canvas entry
│   └── globals.css                      # Modern CSS design system
├── components/                          # React UI Components
│   ├── DigitClassifier.tsx              # Top-level composition component
│   ├── Canvas/                          # Interactive 28x28 drawing canvas
│   ├── Result/                          # Prediction & confidence bar
│   └── Admin/                           # Supabase Admin gallery & dataset manager
├── hooks/                               # Custom React Hooks
│   ├── useDigitClassifier.ts            # Drawing state machine & Supabase logging
│   └── useAdmin.ts                      # Supabase Auth session & verified dataset query
├── services/                            # API Service Layer
│   ├── digitApi.ts                      # Calls /api/predict on ML service
│   ├── http.ts                          # Fetch HTTP client wrapper
│   └── types.ts                         # TypeScript interface definitions
├── utils/
│   └── supabase/
│       └── client.ts                    # Browser Supabase client instance
├── supabase/
│   └── schema.sql                       # Database schema, RLS policies & SQL trigger
├── .env.local                           # Local environment variables
├── .env.local.template                  # Environment template
├── next.config.ts                       # Dev & Prod proxy rewrites (/api/* -> ML API)
├── package.json
└── tsconfig.json
```

---

## 🔐 Environment Variables (`.env.local`)

```env
# 1. Supabase Project Credentials (from Supabase Dashboard -> Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# 2. Standalone ML Microservice URL (used by Next.js rewrites)
# In local development: http://localhost:8008
# In production: https://digit-classification-ml-api.onrender.com
ML_SERVICE_URL=http://localhost:8008
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev
```
* App URL: **http://localhost:3000**

---

## ☁️ Deploying to Vercel (1-Click)

1. Push this repository to GitHub.
2. In **[Vercel Dashboard](https://vercel.com/)**, click **Add New...** $\rightarrow$ **Project**.
3. Import this repository (Root directory is already standard `./`).
4. Add your Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ML_SERVICE_URL` (Your deployed Render ML API URL)
5. Click **Deploy**!
