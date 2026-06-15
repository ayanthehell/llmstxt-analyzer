# LLMS.TXT Analyzer

A free SEO/AI-optimization tool that fetches, parses, and audits a website's `llms.txt` file, scores it across multiple dimensions, identifies gaps, and presents a detailed analysis report.

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS v4
- Backend: Node.js + Express
- No Database required (Stateless)

## Project Structure
- `/client`: Vite + React frontend app
- `/server`: Express backend API

## Setup Instructions

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

3. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

4. Configure Environment Variables:
   In the `/client` directory, create a `.env` file (if it doesn't exist) or update the existing one:
   ```env
   VITE_API_URL=http://localhost:3001/api/analyze
   VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXXX
   ```

## Running Locally

From the root directory, run:
```bash
npm start
```
This uses `concurrently` to start both the Express backend (port 3001) and Vite frontend (port 5173).

## Google AdSense Configuration

To configure Google AdSense, update the following:
1. Replace `VITE_ADSENSE_CLIENT_ID` in `client/.env` with your actual AdSense Publisher ID.
2. If you want specific ad units instead of auto-ads, you can pass a specific `slotId` to the `<AdUnit />` component wherever it is used (e.g., in `Home.jsx` and `Results.jsx`).

## Deployment

### Backend (Railway / Render)
Deploy the `/server` directory as a Node web service.
Set the `PORT` environment variable.

### Frontend (Vercel / Netlify)
Deploy the `/client` directory as a static site.
Build command: `npm run build`
Publish directory: `dist`
Environment variables: Set `VITE_API_URL` to your deployed backend URL, and `VITE_ADSENSE_CLIENT_ID` to your AdSense Publisher ID.
