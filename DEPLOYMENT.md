# CatGPT Deployment Guide

This guide explains how to deploy CatGPT with secure secret management to prevent API keys from being exposed.

## 🔐 Security First: Managing Secrets

**Never commit `.env` or `.env.local` files to GitHub.** These files are already in `.gitignore`.

### Local Development

1. **Server Setup:**
   ```bash
   cd server
   cp .env.example .env
   ```
   Edit `server/.env` and add your:
   - `GOOGLE_API_KEY` - Get from [Google AI Studio](https://aistudio.google.com/app/apikeys)

2. **Client Setup (Optional for local dev):**
   ```bash
   cd client
   cp .env.example .env.local
   ```
   The default `REACT_APP_API_URL=http://localhost:5000` works for local testing.

---

## 🚀 Deployment Options (Free Tier)

### Option 1: **Vercel (Frontend) + Render (Backend)** ⭐ Recommended

#### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import from GitHub
4. Select `catgpt` repo
5. Configure:
   - **Framework Preset:** React
   - **Root Directory:** `client`
6. In "Environment Variables" tab, add:
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com
   ```
7. Deploy!

#### Backend Deployment (Render)
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect GitHub repo
5. Configure:
   - **Name:** catgpt-backend
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r server/requirements.txt`
   - **Start Command:** `cd server && python app.py`
   - **Root Directory:** `/`
6. In "Environment" tab, add secrets:
   ```
   GOOGLE_API_KEY=your_actual_gemini_key_here
   FLASK_ENV=production
   FLASK_DEBUG=False
   PORT=5000
   ```
7. Deploy!

✅ **Pros:**
- Both services have generous free tiers
- Secrets are hidden from public (Render dashboard only)
- Auto-deploys on GitHub push
- No credit card required

❌ **Cons:**
- Render free tier spins down after 15 min inactivity (first request is slow)

---

### Option 2: **Railway** (Full Stack in One Platform)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Grant access to `catgpt` repo
4. Create two services:
   - **Service 1 (Backend):**
     - Point to `server/` folder
     - Runtime: Python
     - Start: `python app.py`
   - **Service 2 (Frontend):**
     - Point to `client/` folder
     - Runtime: Node
     - Build: `npm install && npm run build`
     - Start: `npm start`
5. In Railway dashboard, set environment variables for backend:
   ```
   GOOGLE_API_KEY=your_actual_gemini_key_here
   FLASK_ENV=production
   FLASK_DEBUG=False
   ```
6. Link services and deploy

✅ **Pros:**
- Single platform, unified dashboard
- Free tier: $5/month credit (covers small projects)
- No cold starts like Render

❌ **Cons:**
- Free tier limited ($5/month may run out for heavy usage)
- Slightly more complex setup

---

### Option 3: **Netlify (Frontend) + Heroku (Backend)**

**Note:** Heroku free tier was discontinued in 2022. Use Render or Railway instead.

---

## 🔒 CI/CD with GitHub Actions (Optional Advanced Setup)

If you want automatic deployments without exposing secrets:

1. **On Vercel / Render / Railway dashboard:**
   - Add your `GOOGLE_API_KEY` as a secret environment variable
   - Platforms handle this securely (never exposed in logs or browser)

2. **In `.github/workflows/deploy.yml` (if you set it up):**
   ```yaml
   name: Deploy
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to Render
           run: |
             curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }} \
               -H "Content-Type: application/json"
   ```
   
   **Add GitHub Secrets:**
   - Go to repo Settings → Secrets → "New repository secret"
   - Add `RENDER_DEPLOY_HOOK` (from Render dashboard)
   - GitHub Actions will NOT expose these in logs

---

## ✅ Verification Checklist

Before deployment:

- [ ] `.env` is in `.gitignore` (verified)
- [ ] `.env.local` is in `.gitignore` (verified)
- [ ] Credentials in repo: **0 instances** (run `git log --all --source --full-history -- .env | head -20` to verify)
- [ ] Deployment platform has secret management (Vercel/Render/Railway support this)
- [ ] API URL in client `.env` points to deployed backend
- [ ] Test the deployed app end-to-end

---

## 🧪 Testing Deployed App

```bash
# Test backend is running
curl https://your-render-backend.onrender.com/

# Test chat endpoint (if exposed)
curl -X POST https://your-render-backend.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"How are you?"}'
```

---

## 🚨 If You Accidentally Committed Secrets

1. **Immediately rotate the API key** at [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Force-push to remove from history (⚠️ risky, use BFG Repo-Cleaner for large repos):
   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch .env' \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Create new `.env` with rotated key and re-deploy

---

## 📞 Support & Troubleshooting

**Free Tier Limitations:**
- Render: 0.5 CPU, 512 MB RAM (spins down after 15 min)
- Railway: $5/month free credit
- Vercel: 100 GB bandwidth/month

**Common Issues:**
- "Backend not responding": Check environment variables on deployment platform
- "CORS error": Update `FLASK_CORS` in `server/app.py` if needed
- "Cold start slow": Normal on free tiers; upgrade to paid for always-on

---

Happy deploying! 🎉
