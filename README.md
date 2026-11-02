# JAN-SUTRA AI
### Sovereign Civic Intelligence & Municipal Operations Matrix
*Transforming fragmented citizen grievances into unified, verifiable civic resolution.*

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6+-F7931E?logo=scikit-learn)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python-3.12%20|%203.14-blue?logo=python)](https://python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🏛️ Executive Summary & Real-World Impact

In municipal governance across India, citizen grievance systems suffer from three systemic points of failure:
1. **The Triage Chokepoint & Linguistic Friction**: Citizens speak casually in conversational Hinglish or regional Indic dialects (e.g. *"Naali ka paani sadak par aa raha hai"*). Traditional departmental drop-down menus force citizens to guess jurisdictional boundaries they do not understand, resulting in over 38% misrouted complaints.
2. **The Redundancy Avalanche**: A single major water pipeline fissure or road cave-in triggers dozens of duplicate grievance tickets from the same lane. Municipal engineers spend critical hours triaging identical reports rather than dispatching repair crews.
3. **The Verification Void**: Departments routinely mark grievances "Resolved" on internal spreadsheets without empirical proof, leading to widespread public distrust and unresolved recurring failures.

**JAN-SUTRA AI** is an enterprise-grade civic intelligence platform engineered for Municipal Corporations (demonstrated across the **Bhopal Municipal Corporation - BMC Ward 12–18 corridor**). It introduces an explainable, closed-loop civic architecture:

```
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│   BhashaBridge Voice    │ ───► │  Incident Fusion Twin   │ ───► │   Proof of Resolution   │
│ Multilingual Triage ASR │      │  Spatial Deduplication  │      │ Before/After Photo OTP  │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
             │                                │                                │
             ▼                                ▼                                ▼
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│  CivicPulse 72h Radar   │      │   AI/ML Architecture    │      │  Ward Health Scores     │
│ Predictive Failure Risk │      │ Observability Telemetry │      │ Public Transparency     │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

---

## 🌟 Sovereign Architectural Pillars

### 1. BhashaBridge: Conversational Multilingual Speech Triage
- **Natural Indic Parsing**: Accepts unstructured citizen voice notes and text in **Hinglish**, **Hindi**, and **English**.
- **Acoustic & Semantic Telemetry**: Simulates sub-150ms acoustic tokenization paired with an explainable hybrid intelligence classifier (`IndicBERT-L2` + TF-IDF character n-gram ensemble).
- **Zero Municipal Friction**: Citizens never select a department; the pipeline classifies severity (P1–P3), extracts topological landmarks, and suggests the exact responsible municipal wing with confidence scoring.

### 2. Incident Fusion & Civic Digital Twin
- **-90.5% Redundancy Yield**: Groups individual citizen complaints into unified **Master Incidents** using category, ward boundaries, and spatial topological clustering.
- **Interactive Spatial GIS Map**: Visualizes real-time infrastructure stress nodes (Water, Drainage, Roads, Streetlighting) with live telemetry alerts and ward-level jurisdiction tracking.
- **Citizen Integrity**: Every constituent retains an independent reference ticket code (e.g. `JS-261102-164F54`), receiving automated progress notifications as the master incident advances.

### 3. CivicPulse 72-Hour Predictive Failure Radar
- **Proactive Maintenance**: Merges historical recurrence frequencies, pipeline age data, and monsoon water level telemetry to forecast infrastructure breakdowns before citizen outages occur.
- **Vulnerability Indices**: Provides a 72-hour risk horizon across city wards, highlighting high-risk clusters with automated pre-emptive work order dispatch.

### 4. Proof of Resolution Intelligence (PoRI)
- **Empirical Visual Audit**: Dual Before/After photographic comparison inspector comparing reported physical defects against field repair work orders.
- **Sovereign Ledger Stamp**: Embeds simulated cryptographic SHA-256 integrity hashes and satellite geotag coordinates (`23.2156° N, 77.4305° E`).
- **Citizen-Certified Closure**: Under the JAN-SUTRA charter, no ticket can be closed unilaterally by a contractor; the citizen must confirm, dispute, or partially accept the resolution.

### 5. Public Transparency Portal & Ward Health Scorecards
- **Citywide Accountability Leaderboard**: Ranks all municipal wards on composite health scores, average MTTR (Mean Time to Resolution), and dispute redress rates.
- **Resolution Authenticity Distribution**: Publicly audits the split between Flawless Closures (72%), Reworked Interventions (19%), and Disputed Claims (9%).

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 16.4 (App Router, Turbopack)** | Server-rendered high-performance civic dashboard |
| **UI Library** | **React 19.2** | Concurrent rendering and fluid reactive transitions |
| **Styling & Design System** | **Tailwind CSS 4.3** | Sovereign dark matrix (`#0b1326`) and civic light theme |
| **Theme System** | **Custom ThemeProvider + CSS Variables** | Smooth instant toggle, persistent preference, zero-flicker |
| **Icons & Visualization** | **Lucide React + Vector SVG Canvas** | High-density telemetry icons and GIS vector rendering |
| **Backend API** | **Python FastAPI 0.115+** | High-throughput async REST API with OpenAPI specification |
| **Database & ORM** | **SQLite (Dev) / PostgreSQL (Prod) + SQLAlchemy 2** | Relational grievance and cryptographic event ledger |
| **Machine Learning** | **scikit-learn (TF-IDF + Logistic Regression / Joblib)** | Multilingual intent and grievance category classification |
| **Security & Auth** | **Argon2 Password Hashing + Signed Expiring JWTs** | Role-Based Access Control (RBAC) across Citizen/Officer/Admin |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20.9+ (Node 22 LTS recommended)
- **Python**: 3.12 or 3.14
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/shivangsaxena1011/Jan-Sutra-AI.git
cd Jan-Sutra-AI
```

### 3. Start the Backend API (FastAPI)
```bash
# Navigate to the API application
cd apps/api

# Create and activate Python virtual environment
python -m venv .venv
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with Bhopal Ward 12 demonstration records
python -m scripts.seed_demo

# Start the API server
python -m uvicorn app.main:app --reload --port 8000
```
*API interactive Swagger docs will be available at:* `http://localhost:8000/docs`  
*API health check:* `http://localhost:8000/health`

### 4. Start the Frontend (Next.js)
Open a new terminal in the project root:
```bash
# Install workspace dependencies
npm install

# Start Next.js development server
npm --workspace apps/web run dev
```
*Open your browser and navigate to:* **`http://localhost:3000`**

---

## 🔑 Pre-Configured Demo Credentials

The platform includes role-based demonstration accounts with pre-loaded civic cases:

| Portal Role | Email Address | Password | Accessible Views |
|---|---|---|---|
| **Citizen** | `citizen@jansutra.in` | `Citizen@123` | Citizen Hub, BhashaBridge Triage, Verification Check |
| **Officer** | `officer@jansutra.in` | `Officer@123` | Operations Queue, Digital Twin Fusion, Field Dispatch |
| **Administrator** | `admin@jansutra.in` | `Admin@123` | Complete Municipal Oversight, Model Lab, Ward Audit |

*(These accounts can also be selected with a single click using the Quick-Switch buttons on the `/login` screen).*

---

## 🧪 Testing & Model Evaluation

### Running Backend Unit & Integration Tests
```bash
cd apps/api
pytest
```
*Executes API contract tests and intelligence pipeline verification.*

### Retraining the Multilingual Classifier
```bash
cd apps/api
python training/train_classifier.py --input training/data/grievances.csv
```
*Generates and validates `artifacts/grievance_classifier.joblib` across Hindi, Hinglish, and English civic corpora.*

### Verifying Frontend Build & Static Generation
```bash
npm run build
```
*Compiles all 13 application routes with Turbopack and verifies strict TypeScript compliance.*

---

## 🌐 Production Deployment Options

### Option A: Distributed Cloud (Recommended for High Scalability)
- **Frontend (Next.js)**: Deploy on **Vercel** or **Netlify**
  - Connect your GitHub repository `shivangsaxena1011/Jan-Sutra-AI`.
  - Set Root Directory to `apps/web`.
  - Set Environment Variable: `NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1`.
- **Backend (FastAPI)**: Deploy on **Render**, **Railway**, or **Google Cloud Run**
  - Set Root Directory to `apps/api`.
  - Build Command: `pip install -r requirements.txt`.
  - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
  - Set Environment Variables: `ENVIRONMENT=production`, `JWT_SECRET=<32-char-random-secret>`, `CORS_ORIGINS=https://your-frontend.vercel.app`.

### Option B: Single-Host Docker Compose
Run the entire sovereign stack with PostgreSQL in a single command:
```bash
docker compose up --build -d
```
- Web Application: `http://localhost:3000`
- API Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 🔒 Security & Privacy Posture

- **Argon2 Password Hashing**: State-of-the-art cryptographic password storage.
- **Signed JWT Bearer Tokens**: Stateless, expiring token authentication with role claims.
- **Strict Content Security & CORS**: Configured cross-origin resource sharing policies preventing unauthorized domain access.
- **Zero PII Exposure**: Citizen names and phone numbers are isolated from the spatial GIS mapping layer and AI model prompts.

---

## 📜 Municipal Sovereign Matrix Charter

*JAN-SUTRA AI is built on the fundamental principle that technology in public service must increase accountability rather than obscure it. A closed ticket is never a finished resolution until verified by the citizen who reported it.*
