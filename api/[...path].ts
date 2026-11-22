import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server.js';

// Let Express parse the incoming JSON stream instead of consuming it in Vercel first.
export const config = { api: { bodyParser: false } };

const expressHandler = app as unknown as (req: VercelRequest, res: VercelResponse) => unknown;

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Some adapters expose the catch-all route segments only in req.query.path.
  if (!req.url || req.url.includes('[...path]')) {
    const segments = req.query.path;
    const suffix = Array.isArray(segments) ? segments.join('/') : String(segments || '');
    req.url = `/api/${suffix}`;
  }
  return expressHandler(req, res);
}
