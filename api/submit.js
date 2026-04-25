/**
 * POST /api/submit
 * Receives an automation idea from the dashboard widget and creates a row
 * in the AI Automation Roadmap Notion database.
 *
 * Expected JSON body:
 *   { what: string, hours?: string, how?: string, name?: string }
 *
 * Notion row mapping:
 *   Name          ← what
 *   Description   ← "Hours saved: {hours}/week. {how}"
 *   Status        ← "Suggested"
 *   Priority      ← "Medium"
 *   Submitted by  ← name || "Anonymous"
 *   Submitted at  ← ISO timestamp (now)
 */

const https = require('https');

const NOTION_DB_ID = 'c53d8809-a344-4f2d-aa7f-862b5ca19161';
const NOTION_API   = 'api.notion.com';
const NOTION_VER   = '2022-06-28';

/**
 * Thin wrapper around Notion REST API — no dependencies needed.
 */
function notionPost(path, token, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: NOTION_API,
      path,
      method: 'POST',
      headers: {
        'Authorization':  `Bearer ${token}`,
        'Content-Type':   'application/json',
        'Notion-Version': NOTION_VER,
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`Notion ${res.statusCode}: ${raw}`));
          }
        } catch (e) {
          reject(new Error(`JSON parse error: ${raw}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Express-compatible route handler.
 * Also exported as `handler(payload)` for direct testing.
 */
async function handler(payload) {
  const token = process.env.NOTION_API_KEY;
  if (!token) throw new Error('NOTION_API_KEY environment variable is not set.');

  const { what, hours, how, name } = payload;

  if (!what || !what.trim()) {
    const err = new Error('Field "what" is required.');
    err.status = 400;
    throw err;
  }

  // Build description from hours + how
  const descParts = [];
  if (hours && hours.trim()) descParts.push(`Hours saved: ${hours.trim()}/week.`);
  if (how && how.trim())     descParts.push(how.trim());
  const description = descParts.join(' ');

  const notionPayload = {
    parent: { database_id: NOTION_DB_ID },
    properties: {
      Name: {
        title: [{ text: { content: what.trim() } }],
      },
      ...(description && {
        Description: {
          rich_text: [{ text: { content: description } }],
        },
      }),
      Status: {
        select: { name: 'Suggested' },
      },
      Priority: {
        select: { name: 'Medium' },
      },
      'Submitted by': {
        rich_text: [{ text: { content: (name && name.trim()) || 'Anonymous' } }],
      },
      'Submitted at': {
        date: { start: new Date().toISOString() },
      },
    },
  };

  const result = await notionPost('/v1/pages', token, notionPayload);
  return { id: result.id, url: result.url };
}

/** Express middleware wrapper */
async function expressHandler(req, res) {
  try {
    const result = await handler(req.body);
    res.json({ ok: true, notion_id: result.id, url: result.url });
  } catch (err) {
    const status = err.status || 500;
    console.error('[submit] Error:', err.message);
    res.status(status).json({ ok: false, error: err.message });
  }
}

module.exports = expressHandler;
module.exports.handler = handler; // for testing
