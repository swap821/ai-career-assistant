<div align="center">

# 🤖 AI Career Assistant

**AI-powered career coaching platform — Resume Parsing, Skill Gap Analysis, AI Mock Interviews & Job Matching**

<p>
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-2.3+-000000?style=flat-square&logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.2+-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind-3.3+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_Bedrock-Claude_3_Haiku-FF9900?style=flat-square&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/spaCy-NER-09A3D5?style=flat-square&logo=spacy&logoColor=white" />
</p>

<p>
  <a href="https://swapnil-kumar-portfolio016.vercel.app" target="_blank"><img src="https://img.shields.io/badge/Portfolio-Live-00C853?style=for-the-badge&logo=vercel&logoColor=white" /></a>
  <a href="#-deployment"><img src="https://img.shields.io/badge/Backend-Render-000000?style=for-the-badge&logo=render&logoColor=white" /></a>
  <a href="#-deployment"><img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
</p>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#%EF%B8%8F-architecture)
- [Features](#-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🎯 Overview

**AI Career Assistant** is a full-stack intelligent career coaching platform designed to help job seekers prepare, practice, and land their dream roles. It combines **Natural Language Processing (NER with spaCy)**, **Retrieval-Augmented Generation (RAG) via AWS Bedrock (Claude 3 Haiku)**, and **Semantic Search (Sentence-Transformers)** to deliver a complete career toolkit.

**What it does:**
- 📄 Parses PDF/DOCX resumes and extracts structured data (skills, experience, education, projects)
- 📊 Analyzes skill gaps between your resume and target job descriptions with visual radar charts
- 🎤 Generates personalized AI mock interview questions from your actual resume content
- 🔍 Matches you with jobs using semantic similarity (BERT embeddings + cosine similarity)

**Built by:** Swapnil Kumar — BCA 2nd Year, Full-Stack ML Developer

---

## 🏗️ Architecture

```
                    ┌─────────────────────────────────────┐
                    │        React + Tailwind Frontend     │
                    │   (React Router, Recharts, Framer)   │
                    └──────────────┬──────────────────────┘
                                   │  HTTP REST API
                    ┌──────────────▼──────────────────────┐
                    │           Flask Backend              │
                    │   (Gunicorn, CORS, File Upload)      │
                    └──────────┬────────────┬──────────────┘
                               │            │
              ┌────────────────┘            └────────────────┐
              ▼                                              ▼
    ┌────────────────────┐                    ┌──────────────────────┐
    │  Resume Parser     │                    │  Job Match Engine    │
    │  (spaCy NER + TF-  │                    │  (Sentence-Transformers│
    │   IDF + Regex)     │                    │   + Cosine Similarity) │
    └──────────┬─────────┘                    └──────────┬───────────┘
               │                                         │
               ▼                                         ▼
    ┌────────────────────┐                    ┌──────────────────────┐
    │  Skill Gap Analyzer│                    │  Interview Generator  │
    │  (Skill taxonomy   │                    │  (AWS Bedrock Claude  │
    │   comparison)      │                    │   3 Haiku + RAG)      │
    └────────────────────┘                    └──────────────────────┘
```

---

## ✨ Features

| Feature | Description | Technologies |
|---------|-------------|--------------|
| **📄 Smart Resume Parser** | Upload PDF/DOCX → extracts skills, experience, education, projects, certifications | spaCy NER, pdfplumber, python-docx, TF-IDF |
| **📊 Skill Gap Analyzer** | Compare your resume against any job description — visual radar chart of matched/missing skills | Custom skill taxonomy, Recharts.js |
| **🎤 AI Mock Interview** | Personalized interview questions generated from YOUR resume context using RAG + Claude | AWS Bedrock (Claude 3 Haiku), RAG pattern |
| **🔍 Semantic Job Matcher** | Upload a job description, get a match score based on BERT embeddings | sentence-transformers, cosine similarity |
| **📈 Real-Time Charts** | Interactive visualizations for skill gaps and match scores | Recharts.js |
| **📱 Responsive Design** | Fully responsive dark-themed premium UI | Tailwind CSS, Framer Motion |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.10+** | Core language |
| **Flask 2.3+** | REST API framework |
| **Gunicorn** | WSGI HTTP server for production |
| **spaCy + en_core_web_sm** | Named Entity Recognition for resume parsing |
| **AWS Bedrock (Claude 3 Haiku)** | LLM for interview question generation & answer evaluation |
| **Sentence-Transformers (all-MiniLM-L6-v2)** | Semantic text embeddings for job matching |
| **pdfplumber + python-docx** | Document text extraction |
| **scikit-learn** | TF-IDF vectorization & cosine similarity |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18.2+** | UI framework |
| **React Router** | Client-side routing |
| **Tailwind CSS 3.3+** | Utility-first styling |
| **Recharts** | Interactive data visualization |
| **Framer Motion** | Smooth animations & transitions |
| **Axios** | HTTP client for API calls |

### Deployment
| Platform | Service |
|----------|---------|
| **Render** | Flask backend hosting |
| **Vercel** | React frontend hosting |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- AWS account (for Bedrock access) or use fallback mode
- spaCy English model

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/swap821/ai-career-assistant.git
cd ai-career-assistant/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Download spaCy model
python -m spacy download en_core_web_sm

# 5. Environment variables
cp .env.example .env
# Edit .env with your AWS credentials (or leave blank for fallback mode)

# 6. Start the server
python app.py
# API runs at http://localhost:5000
```

### Frontend Setup

```bash
cd ../frontend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# UI runs at http://localhost:5173
```

---

## 📡 API Reference

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/parse-resume` | Upload & parse resume (PDF/DOCX) |
| `POST` | `/api/skill-gap` | Analyze skill gaps vs job description |
| `POST` | `/api/interview/generate` | Generate AI interview questions |
| `POST` | `/api/interview/evaluate` | Evaluate interview answer |
| `POST` | `/api/job-match` | Calculate semantic job match score |

### Example: Parse Resume

```bash
curl -X POST http://localhost:5000/api/parse-resume \
  -F "resume=@/path/to/resume.pdf"
```

**Response:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "skills": ["Python", "React", "Machine Learning"],
  "experience": [{"role": "Developer", "company": "Tech Corp"}],
  "education": [{"degree": "B.Tech", "institution": "XYZ University"}]
}
```

### Example: Generate Interview Questions

```bash
curl -X POST http://localhost:5000/api/interview/generate \
  -H "Content-Type: application/json" \
  -d '{
    "resume_context": "Skills: Python, React, SQL. Experience: 2 years web dev.",
    "job_role": "Full Stack Developer",
    "difficulty": "intermediate"
  }'
```

### Example: Job Match Score

```bash
curl -X POST http://localhost:5000/api/job-match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Python, React, AWS, 3 years experience...",
    "job_description": "Looking for Python developer with React..."
  }'
```

---

## 🌍 Deployment

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo (`swap821/ai-career-assistant`)
3. Set root directory to `backend/`
4. Build Command: *(none)*
5. Start Command: `python -m spacy download en_core_web_sm && gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120`
6. Add environment variables from `.env.example`
7. Deploy!

### Frontend → Vercel

1. Import your repo on [Vercel](https://vercel.com)
2. Set framework preset to **Vite**
3. Set root directory to `frontend/`
4. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`
5. Deploy!

### One-Click Deploy

| Platform | Button |
|----------|--------|
| Render | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/swap821/ai-career-assistant) |

---

## 📁 Project Structure

```
ai-career-assistant/
├── backend/
│   ├── app.py                     # Flask app entry point
│   ├── bedrock_client.py          # AWS Bedrock (Claude) integration
│   ├── interview_generator.py     # RAG-based interview generation
│   ├── resume_parser.py           # spaCy NER + TF-IDF resume parsing
│   ├── skill_gap_analyzer.py      # Skill taxonomy comparison
│   ├── job_matcher.py             # Semantic job matching engine
│   ├── requirements.txt           # Python dependencies
│   ├── Procfile                   # Render deployment config
│   ├── render.yaml                # Render blueprint
│   ├── .env.example               # Environment variables template
│   └── DEPLOYMENT.md              # Detailed deployment guide
│
└── frontend/
    ├── src/
    │   ├── components/            # Reusable UI components
    │   ├── pages/                 # Route-level pages
    │   ├── hooks/                 # Custom React hooks
    │   ├── services/              # API call functions
    │   └── App.jsx                # Root component
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AIOS_BEDROCK_REGION` | AWS region for Bedrock (default: `us-east-1`) | Optional |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | Optional* |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | Optional* |
| `AWS_BEARER_TOKEN_BEDROCK` | AWS session token (if using temp credentials) | Optional* |
| `BEDROCK_MODEL_ID` | Claude model ID (default: `anthropic.claude-3-haiku-20240307-v1:0`) | Optional |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | Optional |
| `PORT` | Server port (auto-set on Render) | Auto |

> **Note:** If AWS credentials are not provided, the app gracefully falls back to pre-built interview questions — no crashes!

---

## 📸 Screenshots

| Resume Parser | Skill Gap Analyzer | AI Mock Interview | Job Matcher |
|--------------|-------------------|-------------------|-------------|
| Upload PDF/DOCX, extract structured data | Visual radar chart comparing skills | Context-aware AI questions via Claude | BERT-powered semantic matching |

> 🌐 **[Live Demo](https://swapnil-kumar-portfolio016.vercel.app)** — See the portfolio for live project links

---

## 🗺️ Roadmap

- [ ] Add cover letter generator using Claude
- [ ] LinkedIn profile import support
- [ ] Interview recording & transcription (Whisper API)
- [ ] User authentication & saved interview history
- [ ] More LLM provider options (OpenAI, local models)
- [ ] Job scraping from LinkedIn/Indeed

---

## 🙋 Author

**Swapnil Kumar**
- 🎓 BCA 2nd Year Student
- 💼 Aspiring Full-Stack ML Engineer
- 🌐 [Portfolio](https://swapnil-kumar-portfolio016.vercel.app)
- 💻 [GitHub](https://github.com/swap821)
- 🔗 [LinkedIn](https://linkedin.com/in/swapnil-kumar)

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-ff69b4?style=flat-square" />
  <img src="https://img.shields.io/badge/Built%20for-BCA%20Portfolio-00C853?style=flat-square" />
</p>
