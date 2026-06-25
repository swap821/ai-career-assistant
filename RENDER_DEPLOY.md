# Quick Deploy to Render

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect GitHub repo: `swap821/ai-career-assistant`
4. Configure:
   - **Name**: `ai-career-assistant-api`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120`
5. Add Environment Variables:
   - `AIOS_BEDROCK_REGION` = `us-east-1`
   - `AWS_ACCESS_KEY_ID` = your AWS access key
   - `AWS_SECRET_ACCESS_KEY` = your AWS secret key
6. Click "Create Web Service"

Your backend URL: `https://ai-career-assistant-api.onrender.com`
