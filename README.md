# PitchBridge 🚀

A platform connecting founders with investors, powered by AI idea analysis.

## Prerequisites
- Node.js 18+
- MongoDB running locally (or update MONGO_URI in server/.env)

## Run the Backend
```bash
cd server
node index.js
```
Server runs on http://localhost:5000

## Run the Frontend
```bash
cd client
npm run dev
```
Frontend runs on http://localhost:5173

## When you get API keys
- OpenAI: Add key to `server/.env` → `OPENAI_API_KEY=sk-...` then update `server/services/aiService.js`
- Google OAuth: Add `GOOGLE_CLIENT_ID` to `.env` and replace mock in `server/routes/auth.js`
