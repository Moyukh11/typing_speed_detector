# MERN Typing Speed Detector

A full-stack typing speed detector app built with MongoDB, Express, React, and Node.js.

## Structure

- `server/` - Express backend with MongoDB persistence
- `client/` - React frontend powered by Vite

## Run locally

1. Install dependencies:
   - `cd server && npm install`
   - `cd client && npm install`
   - `npm install` (for root scripts)

2. Create `.env` in `server/` from `.env.example`.

3. Start MongoDB locally or provide a MongoDB Atlas URI.

4. Run the app:
   - `npm run dev`

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.
