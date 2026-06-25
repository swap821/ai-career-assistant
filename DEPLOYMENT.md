# Deployment Guide - AI Career Assistant

## Quick Deploy (Render + Vercel)

### Backend (Render)

1. Go to [render.com](https://render.com) → "New Web Service"
2. Connect your GitHub repo: `swap821/ai-career-assistant`
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('averaged_perceptron_tagger')"`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120`
4. Add Environment Variables:
   - `GEMINI_API_KEY` = your Google Gemini API key
   - `ALLOWED_ORIGINS` = your Vercel frontend URL
5. Click "Create Web Service"
6. Copy the service URL (e.g., `https://ai-career-assistant.onrender.com`)

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → "Add New Project"
2. Import your GitHub repo: `swap821/ai-career-assistant`
3. Set **Framework Preset** to "Vite"
4. Set **Root Directory** to `frontend`
5. Add Environment Variable:
   - `VITE_API_URL` = your Render backend URL
6. Click "Deploy"

---

## Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('averaged_perceptron_tagger')"
python app.py               # Starts Flask server on localhost:5000

# Frontend
cd frontend
npm install
npm run dev                 # Starts dev server on localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key - get from [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `FLASK_ENV` | No | Set to `production` for deployment |
| `ALLOWED_ORIGINS` | Yes | Comma-separated CORS origins |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resume/parse` | POST | Upload and parse resume (PDF/DOCX) |
| `/api/resume/analyze-skills` | POST | Skill gap analysis |
| `/api/interview/generate` | POST | Generate AI interview questions |
| `/api/interview/evaluate` | POST | Evaluate interview answer |
| `/api/jobs/templates` | GET | Get job templates |
| `/api/jobs/match-all` | GET | Match resume against all jobs |
| `/api/skills/database` | GET | Get skills database |
| `/api/health` | GET | Health check |

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and add it to your `.env` file and Render environment variables

## Troubleshooting

**Issue**: `ModuleNotFoundError: No module named 'spacy'`
**Fix**: Run `pip install spacy && python -m spacy download en_core_web_sm`

**Issue**: `ModuleNotFoundError: No module named 'sentence_transformers'`
**Fix**: Run `pip install sentence-transformers`

**Issue**: Gemini API errors
**Fix**: Check your `GEMINI_API_KEY` is valid and has quota remaining. The app has fallback questions if API is unavailable.

**Issue**: CORS errors in browser
**Fix**: Add your Vercel URL to `ALLOWED_ORIGINS` in Render environment variables
