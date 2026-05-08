# 🧠 MindWell
> Empowering mental health through AI-driven insights, mood tracking, and persistent crisis support.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/yash112005/MindWell)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)

## 📖 Description
MindWell is a secure, comprehensive web application designed to support mental well-being. It features a robust Role-Based Access Control (RBAC) system and offers tools for mood tracking, journaling, and AI-powered insights.
* ✨ **AI Insights Engine**: Analyze journal entries and mood trends to provide personalized feedback.
* 📊 **Mood Tracking & Analytics**: Visualize emotional well-being with heatmaps and streak tracking.
* 🚨 **Crisis Support System**: Persistent, immediate access to crisis resources and alerts.
* 🔒 **Secure RBAC**: Robust Role-Based Access Control ensuring data privacy and route protection.
* 📱 **Responsive UI**: A beautiful, modern interface with dark mode support for all devices.

## 🎯 Key Highlights
- 🤖 AI-powered journal analysis using Gemini API
- 📊 Mood heatmaps & streak tracking
- 🚨 Real-time crisis support system
- 🔐 Role-based access control (RBAC)
- 🌙 Dark mode support

## 💻 Tech Stack
* **Frontend**: React, Vite, Tailwind CSS 4
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **Authentication**: JWT, Secure RBAC, WebSockets
* **AI**: Gemini API Integration , NLP 

## 🚀 Installation
1. Clone the repository:
```bash
   git clone https://github.com/yash112005/MindWell.git
   cd MindWell
```
2. Install dependencies for both server and client:
```bash
   cd server && npm install
   cd ../client && npm install
```

## 💡 Usage
1. Start the backend development server:
```bash
   cd server
   npm run dev
```
2. Start the frontend development server:
```bash
   cd client
   npm run dev
```
3. Open `http://localhost:5173` in your browser to access the MindWell dashboard.

## ⚙️ Configuration
Create a `.env` file in the `server` directory based on your environment needs:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindwell
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

## 🔌 API Documentation
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user and return token |
| `POST` | `/api/journal` | Create a new journal entry |
| `GET` | `/api/analytics/mood` | Get mood trends and heatmap data |
| `POST` | `/api/crisis/alert` | Trigger a crisis support alert |

## 👥 Team
| Name | Role |
|------|------|
| Yash Namdeo(Team Leader)| Backend & AI Logic |
| Vedansh Sahu | Frontend |
| Pradyumn Awasthi | Database (MongoDB) |

## 🎓 About
Built as a **Minor Project** — April 2026

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements
* [React](https://reactjs.org/) for the UI library.
* [Tailwind CSS](https://tailwindcss.com/) for the styling framework.
* [Express](https://expressjs.com/) for the robust backend framework.
* [Google Gemini](https://ai.google.dev/) for the AI API.

## 💬 Contact & Support
* **Email**: ynamdeo248@gmail.com
* **GitHub**: [@yash112005](https://github.com/yash112005)
* **LinkedIn**: [linkedin.com/in/yash-namdeo-48412531a](https://linkedin.com/in/yash-namdeo-48412531a)