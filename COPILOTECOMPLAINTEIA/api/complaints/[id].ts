import type { VercelRequest, VercelResponse } from '@vercel/node';
import { complaintsStore, setCors } from '../_lib/engine';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = String(req.query.id);
  const complaint = complaintsStore.find(c => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const similar = complaintsStore
    .filter(c => c.id !== complaint.id && (c.product === complaint.product || c.issue === complaint.issue))
    .slice(0, 3);

  res.status(200).json({ data: complaint, similar });
}
