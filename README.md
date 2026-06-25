# AI Career Assistant — Full-Stack AI Portfolio Capstone

## Overview
AI-powered career coaching with resume parsing (spaCy NER), skill gap analysis, AI mock interviews (Gemini LLM + RAG), and semantic job matching.

## Architecture
```
Resume Upload → spaCy NER → Skill Extractor → Gemini LLM (RAG) → Mock Interview
                                    ↓
                        Job Matcher (Vector Similarity)
```

## Features
1. **Resume Parser** — PDF/DOCX → structured data (skills, experience, education)
2. **Skill Gap Analyzer** — Compare resume vs job descriptions
3. **AI Mock Interview** — Gemini generates personalized questions from your resume
4. **Job Match Scorer** — Sentence-transformers + cosine similarity

## Tech Stack
- Flask, spaCy, Scikit-learn, Sentence-Transformers, Google Gemini
- React, React Router, Tailwind CSS, Recharts

## Quick Start
```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py  # localhost:5000
cd ../frontend && npm install && npm run dev  # localhost:5173
```

## Author
**Swapnil Kumar** — https://github.com/swap821