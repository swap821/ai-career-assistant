# Quick Deploy to Vercel

1. Go to https://vercel.com/swapnil-kumar-s-projects
2. Click "Add New Project" → Import `ai-career-assistant`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://ai-career-assistant-api.onrender.com`
5. Click "Deploy"
