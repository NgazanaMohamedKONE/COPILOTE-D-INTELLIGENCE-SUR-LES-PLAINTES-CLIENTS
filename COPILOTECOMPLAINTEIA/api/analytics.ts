import type { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateDashboardMetrics, setCors } from './_lib/engine';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const metrics = calculateDashboardMetrics();
  res.status(200).json({ data: metrics });
}
