# AI Career Assistant — Capstone Project

**Live Demo:** [https://63dcmrawskzy4.kimi.page](https://63dcmrawskzy4.kimi.page)

AI-powered career coaching platform with resume parsing (spaCy NER), skill gap analysis, AI mock interviews (Gemini LLM + RAG), and semantic job matching.

## Architecture
```
Resume Upload → spaCy NER → Skill Extractor → Gemini LLM (RAG) → Mock Interview
                                    ↓
                        Job Matcher (Sentence-Transformers)
```

## Features
1. **Resume Parser** — PDF/DOCX → structured data (skills, experience, education)
2. **Skill Gap Analyzer** — Compare resume vs job descriptions with visual charts
3. **AI Mock Interview** — Gemini generates personalized questions from your resume
4. **Job Match Scorer** — Sentence-transformers + cosine similarity ranking

## Tech Stack
- Backend: Python, Flask, spaCy, Scikit-learn, Sentence-Transformers, Google Gemini
- Frontend: React, React Router, Tailwind CSS, Recharts, Framer Motion

## Quick Start
```bash
cd backend
cp .env.example .env
# Add your GEMINI_API_KEY to .env
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py              # API on localhost:5000
cd ../frontend
npm install && npm run dev  # UI on localhost:5173
```

## Deploy
- Backend: [Deploy to Render](https://render.com/deploy?repo=https://github.com/swap821/ai-career-assistant)
- See `DEPLOYMENT.md` for full instructions

## Author
**Swapnil Kumar** — [Portfolio](https://swapnil-kumar-portfolio016.vercel.app) | [GitHub](https://github.com/swap821)
