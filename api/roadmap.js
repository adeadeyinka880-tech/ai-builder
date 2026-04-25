/**
 * GET  /api/roadmap  — return all rows from AI Automation Roadmap DB
 * PATCH /api/roadmap  — update the Status of a row by Notion page ID
 *
 * Env vars (from .env.local):
 *   NOTION_TOKEN          — integration secret (ntn_...)
 *   NOTION_DATABASE_ID    — c53d8809-a344-4f2d-aa7f-862b5ca19161
 */

const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID  = process.env.NOTION_DATABASE_ID;

/* ── Column key  ↔  Notion Status label ─────────────────────── */
const COL_TO_STATUS = {
  'suggested':   'Suggested',
  'to-build':    'To Build',
  'in-progress': 'In Progress',
  'done':        'Done',
};
const STATUS_TO_COL = Object.fromEntries(
  Object.entries(COL_TO_STATUS).map(([k, v]) => [v, k])
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  /* ── GET ─────────────────────────────────────────────────── */
  if (req.method === 'GET') {
    try {
      const response = await notion.databases.query({ database_id: DB_ID });
      const rows = response.results
        .filter(p => p.properties?.Name?.title?.length > 0)
        .map(p => ({
          id:       p.id,
          name:     p.properties.Name.title[0].text.content,
          status:   p.properties.Status?.select?.name  || 'To Build',
          col:      STATUS_TO_COL[p.properties.Status?.select?.name] || 'to-build',
          priority: p.properties.Priority?.select?.name || 'Medium',
        }));
      return res.json(rows);
    } catch (err) {
      console.error('[roadmap GET]', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  /* ── PATCH ───────────────────────────────────────────────── */
  if (req.method === 'PATCH') {
    const { id, col } = req.body || {};
    const status = COL_TO_STATUS[col];

    if (!id || !status) {
      return res.status(400).json({ error: '"id" (Notion page ID) and "col" (column key) are required.' });
    }

    try {
      await notion.pages.update({
        page_id: id,
        properties: { Status: { select: { name: status } } },
      });
      return res.json({ ok: true, id, status });
    } catch (err) {
      console.error('[roadmap PATCH]', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
