# Neighborhood Playdate Connect

A safe and simple web application for parents to coordinate playdates, find local activities, and connect with nearby families.

## Features

- **Playdate Coordination:** Schedule one-time or recurring playdates.
- **Neighborhood Focus:** Find families in your specific area.
- **AI Activity Finder:** Uses Google Gemini + Maps to suggest kid-friendly spots.
- **Messaging:** Secure direct and group messaging.
- **Safety First:** Community guidelines and local-only focus.

## Tech Stack

- React (Vite)
- TypeScript
- Tailwind CSS
- Google Gemini API (for Activity Finder)

## Setup & Deployment

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Locally:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

### Environment Variables

To use the Activity Finder feature, you need a Google Gemini API Key.
Create a `.env` file (or set in Vercel):

```
VITE_API_KEY=your_api_key_here
```
