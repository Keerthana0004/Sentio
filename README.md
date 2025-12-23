# Sentio: AI-Powered Sentiment Journal 🌟

Sentio is a full-stack wellness application that helps users track their emotional journey using AI-driven insights.

# 🚀 Features

# AI Sentiment Analysis:
Uses Google Gemini 2.5 Flash to analyze journal entries.

# Immediate Insights:
Get empathetic feedback and wellness suggestions instantly.

# Secure Authentication: 
Integrated with Firebase Google Auth.

# Sentiment Tracking: 
Visual stats dashboard tracking positive, negative, and neutral trends.

# Cloud Storage: 
Securely stores entries in Firestore.

# 🛠️ Tech Stack

Frontend: React.js, CSS3 (Flexbox/Grid), Lucide Icons

Backend: Node.js, Express.js

AI: Google Gemini API

Database/Auth: Firebase (Firestore & Authentication)

# 📦 Setup Instructions

Clone the repository.

Run npm install in both the client and server directories.

Create a .env file in the /server directory with your GEMINI_API_KEY.

Add your serviceAccountKey.json for Firebase Admin.

Run npm start in both directories.

Note: This repository was refactored for security to ensure all API credentials and dependencies are properly managed via .gitignore.
