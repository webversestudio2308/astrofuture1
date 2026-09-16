# Astrofuture - Vedic Astrology & Janam Kundali Platform

A full-stack Vedic Astrology and Janam Kundali web application built with React, TypeScript, Tailwind CSS, Express, and Google Gemini AI.

---

## 🌟 Key Features

- **20-Page Comprehensive Vedic Kundali**: Complete birth chart calculations including Lagna, Navamsha, Vimshottari Mahadasha, Antardasha, Ashtakvarga, Sade Sati analysis, Manglik/Kalsarpa Doshas, and gemstone remedies.
- **AI Pandit Ji Live Astrology Chat**: Powered by Google Gemini with contextual Vedic chart synthesis.
- **Dynamic Chart Generator**: North Indian and South Indian diamond Kundali SVG visualization.
- **PDF Report Generation**: Instant 20-page high-resolution PDF download using jsPDF and html2canvas.
- **Sacred ₹51 Dakshina / Razorpay Integration**: Automated payment flow and signature verification.
- **Bilingual**: Full Hindi (हिंदी) and English support.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Run Locally
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🚂 Deploying to Railway

This project is pre-configured with `railway.json` and `Procfile`:
1. Push this repository to GitHub.
2. In [Railway.app](https://railway.app), click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Add `GEMINI_API_KEY` under the **Variables** tab.
4. Railway will automatically run `npm run build` and launch `node dist/server.cjs`.
