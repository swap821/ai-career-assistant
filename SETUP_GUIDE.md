# Setup Guide — AI Career Assistant

## Prerequisites
- Python 3.9+, Node.js 18+
- Google Gemini API key (free at https://aistudio.google.com/app/apikey)

## Step 1: Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cp .env.example .env  # Add GEMINI_API_KEY
python app.py
```

## Step 2: Frontend
```bash
cd frontend
npm install
npm run dev
```

## Fallback Mode
If no Gemini API key, set `GEMINI_API_KEY=fallback` for pre-written questions.