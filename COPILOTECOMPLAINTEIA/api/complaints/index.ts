import type { VercelRequest, VercelResponse } from '@vercel/node';
import { complaintsStore, setCors } from '../_lib/engine';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product, issue, urgency, sentiment, status, search, anomalyOnly } = req.query;
  let results = [...complaintsStore];

  if (product) results = results.filter(c => c.product.toLowerCase().includes(String(product).toLowerCase()));
  if (issue) results = results.filter(c => c.issue.toLowerCase().includes(String(issue).toLowerCase()));
  if (urgency) results = results.filter(c => c.urgency === String(urgency));
  if (sentiment) results = results.filter(c => c.sentiment === String(sentiment));
  if (status) results = results.filter(c => c.status === String(status));
  if (anomalyOnly === 'true') results = results.filter(c => c.isAnomaly);

  if (search) {
    const s = String(search).toLowerCase();
    results = results.filter(c =>
      c.id.toLowerCase().includes(s) ||
      c.clientName.toLowerCase().includes(s) ||
      c.narrative.toLowerCase().includes(s) ||
      c.product.toLowerCase().includes(s) ||
      c.issue.toLowerCase().includes(s) ||
      c.city.toLowerCase().includes(s)
    );
  }

  res.status(200).json({ count: results.length, data: results });
}
