# 🚀 Railway.app Deployment Guide for Astrofuture

This repository is pre-configured for 1-click deployment on **Railway.app** (as well as Render, Docker, and standard Node.js cloud platforms).

---

## ⚙️ How It Works (Pre-Configured Files)

1. **`railway.json`**: Instructs Railway's Nixpacks builder to execute:
   - **Build Command**: `npm run build` (builds Vite frontend + bundles server via esbuild into `dist/server.cjs`)
   - **Start Command**: `npm run start` (`node dist/server.cjs`)
   - **Healthcheck Path**: `/health`
2. **`Procfile`**: Provides `web: npm run start` fallback for platforms that read Procfiles.
3. **`package.json`**:
   - Node engine: `>=20.0.0`
   - Bundled CommonJS server (`dist/server.cjs`) handles both static assets and API routes seamlessly.
4. **Dynamic Port Binding**:
   - Binds to Railway's dynamic `$PORT` in production automatically, while maintaining port `3000` for local dev.

---

## 🛠️ Step-by-Step Deployment Steps on Railway

### 1. Push code to GitHub
Push this complete project repository to your GitHub account.

### 2. Create New Project in Railway
1. Go to [railway.app](https://railway.app) and sign in.
2. Click **"New Project"** ➔ **"Deploy from GitHub repo"**.
3. Select your repository.

### 3. Add Environment Variables in Railway
In your Railway Service dashboard, go to the **"Variables"** tab and add:

| Variable Name | Description | Required? |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API Key | **Yes** (or app uses built-in Vedic offline engine) |
| `RAZORPAY_KEY_ID` | Your Razorpay API Key ID (e.g. `rzp_live_...`) | Optional (mock simulation works if not provided) |
| `RAZORPAY_KEY_SECRET` | Your Razorpay API Key Secret | Optional (needed for live payments) |

### 4. Deploy & Generate Domain
1. Railway will automatically detect the configuration, run `npm run build`, and deploy!
2. In Railway **"Settings"** ➔ **"Networking"**, click **"Generate Domain"** to get your live public HTTPS URL (e.g. `https://astrofuture-production.up.railway.app`).

---

## 🩺 Verifying Deployment
Visit:
- `https://your-domain.up.railway.app/health` ➔ Returns `{"status":"ok"}`
- `https://your-domain.up.railway.app` ➔ Full interactive Astrofuture application
