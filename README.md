# Sentio: AI-Powered Sentiment Journal 🌟

Sentio is a full-stack wellness application that helps users track their emotional journey using AI-driven insights. It provides immediate empathetic feedback and wellness suggestions based on the tone of your journal entries.

---

## 🔗 Live Demo

[View Sentio Live](sentio-7gzif6ekw-keerthana0004s-projects.vercel.app)

> **Note:** The initial load may take **30–60 seconds** as the backend on Render “wakes up” from its free-tier sleep.

---

## 🚀 Features

- **AI Sentiment Analysis:** Leverages Google Gemini 2.5 Flash to analyze the emotional depth and mood of every entry.  
- **Immediate Insights:** Provides instant empathetic responses and actionable wellness tips right after saving.  
- **Secure Authentication:** Robust user isolation via Firebase (Google Auth & Anonymous sign-in).  
- **Sentiment Tracking:** A dashboard featuring real-time statistics for Positive, Negative, and Neutral mood trends.  
- **Cloud Storage:** High-performance data persistence using Firebase Firestore.  
- **Mobile Optimized:** Fully responsive UI designed for journaling on the go.  

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Lucide Icons  
**Backend:** Node.js, Express.js  
**AI Integration:** Google Gemini API  
**Database & Auth:** Firebase Firestore & Firebase Authentication  

---

## 📦 Local Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Sentio.git
cd Sentio
```
### 2. Install Dependencies

Run the following in both the /client and /server directories:

```bash
npm install
```
### 3. Environment Variables
In /server, create a .env file:
```bash
GEMINI_API_KEY=your_key_here
PORT=3001
```
In /client, create a .env file with your Firebase config (all keys must start with REACT_APP_).
### 4. Firebase Admin

Place your serviceAccountKey.json inside the /server directory.

### 5. Run Locally

Start backend:

```bash
node index.js
```
Start frontend:
```bash
npm start
```

# 🌐 Deployment Information
# Backend (Render)

Host: Render.com

Config: Dynamic PORT, GEMINI_API_KEY, and Firebase Admin env variables.

Performance: Uses cors to securely communicate with the Vercel frontend.

# Frontend (Vercel)

Host: Vercel.com

Config: REACT_APP_API_URL pointing to the Render backend.

Optimizations: Automatic production builds + global CDN delivery.

# 🔒 Security Note

This repository was refactored to ensure all API credentials, Firebase configs, and sensitive files are securely managed using .gitignore.
