import type { VercelRequest, VercelResponse } from '@vercel/node';
import { auditLogsStore, setCors } from './_lib/engine';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.status(200).json({ data: auditLogsStore });
}
