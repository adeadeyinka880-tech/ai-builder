/**
 * AI Builder Dashboard — local dev server
 *
 * Serves ai-builder-dashboard.html and mounts the /api handlers.
 * Uses the same handler modules as Vercel serverless functions,
 * so local dev and production behave identically.
 *
 * Setup:
 *   1. Ensure .env.local exists with NOTION_TOKEN + NOTION_DATABASE_ID
 *   2. npm install
 *   3. node server.js
 *   4. Open http://localhost:3001
 */

// Load .env.local first, then .env as fallback
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const express = require('express');
const path    = require('path');

// API handlers (same modules Vercel uses)
const roadmapHandler = require('./api/roadmap');
const submitHandler  = require('./api/submit');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Wrap Vercel-style handlers (req, res) for Express
app.all('/api/roadmap', roadmapHandler);
app.post('/api/submit',  submitHandler);

// Root → dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-builder-dashboard.html'));
});

app.listen(PORT, () => {
  const hasToken = !!process.env.NOTION_TOKEN;
  const hasDb    = !!process.env.NOTION_DATABASE_ID;
  console.log(`\n🚀  Dashboard → http://localhost:${PORT}`);
  console.log(`    GET  /api/roadmap  — fetch Notion rows`);
  console.log(`    PATCH /api/roadmap  — update Status`);
  console.log(`    POST /api/submit   — idea-swap widget`);
  if (!hasToken) console.warn('\n⚠️  NOTION_TOKEN not set (.env.local)');
  if (!hasDb)    console.warn('⚠️  NOTION_DATABASE_ID not set (.env.local)');
  if (hasToken && hasDb) console.log('\n✓  Notion credentials loaded\n');
});
