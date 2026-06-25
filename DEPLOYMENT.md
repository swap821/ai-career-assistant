# Deployment Guide - AI Career Assistant

## Architecture
```
Frontend (Vercel) ←→ Backend API (Render) ←→ AWS Bedrock (Claude)
     React/TS          Flask + spaCy + boto3     LLM for AI features
```

## Step 1: Deploy Backend to Render

Go to [dashboard.render.com](https://dashboard.render.com/)

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repo: `swap821/ai-career-assistant`
3. Configure:
   - **Name**: `ai-career-assistant-api`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120`
4. **Environment Variables** (CRITICAL):

| Key | Value | Source |
|-----|-------|--------|
| `AIOS_BEDROCK_REGION` | `us-east-1` | Your AWS region |
| `AWS_ACCESS_KEY_ID` | `YOUR_KEY` | AWS IAM → Access Keys |
| `AWS_SECRET_ACCESS_KEY` | `YOUR_SECRET` | AWS IAM → Access Keys |
| `AWS_BEARER_TOKEN_BEDROCK` | `YOUR_TOKEN` | Your existing .env file |
| `ALLOWED_ORIGINS` | `https://YOUR_VERCEL_URL` | Set after Step 2 |

5. Click **"Create Web Service"**
6. Wait for build (2-3 min) → Copy the URL (e.g., `https://ai-career-assistant-api.onrender.com`)

> **Note**: AWS Bedrock needs to be enabled in your AWS account. Go to [AWS Bedrock Console](https://us-east-1.console.aws.amazon.com/bedrock/home) → "Model access" → Enable "Claude 3 Haiku".

---

## Step 2: Deploy Frontend to Vercel

Go to [vercel.com/swapnil-kumar-s-projects](https://vercel.com/swapnil-kumar-s-projects)

1. Click **"Add New Project"** → Import `ai-career-assistant`
2. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   - `VITE_API_URL` = your Render backend URL from Step 1
4. Click **Deploy**

---

## Step 3: Update CORS

1. Go back to Render → Your service → Environment
2. Update `ALLOWED_ORIGINS` with your actual Vercel URL
3. Click **Manual Deploy** → **Clear build cache & deploy**

---

## API Endpoints (Test After Deploy)

```bash
# Health check
curl https://YOUR_RENDER_URL/health

# Parse resume
curl -X POST -F "file=@resume.pdf" https://YOUR_RENDER_URL/resume/parse

# Generate interview questions
curl -X POST -H "Content-Type: application/json" \
  -d '{"resume_data": {"skills": ["Python", "React"]}, "num_questions": 5}' \
  https://YOUR_RENDER_URL/interview/generate
```

---

## Troubleshooting

### "Access Denied" on Bedrock
- Enable model access: [AWS Bedrock Console](https://us-east-1.console.aws.amazon.com/bedrock/home) → Model access → Enable Claude

### "No module named 'en_core_web_sm'"
- The render.yaml includes `python -m spacy download en_core_web_sm` in build. If it fails, add it to Render's build command manually.

### CORS errors in browser
- Double-check `ALLOWED_ORIGINS` includes your exact Vercel URL (with `https://`, no trailing slash)

### Fallback questions used instead of AI
- Check Render logs: Settings → Logs. Look for Bedrock client errors.
- Verify AWS credentials are set correctly in environment variables.

## Local Development

```bash
cd backend
cp .env.example .env
# Edit .env with your AWS credentials
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py  # localhost:5000

cd frontend
npm install
npm run dev  # localhost:5173
```
