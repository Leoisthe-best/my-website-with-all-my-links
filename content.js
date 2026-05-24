import { kv } from '@vercel/kv';

const PASSCODE = 'leo and ash are the best cats in the world';
const KEY = 'page-content';
const MAX_LEN = 100000;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const content = (await kv.get(KEY)) || '';
    return res.status(200).json({ content });
  }

  if (req.method === 'POST') {
    const { passcode, content } = req.body || {};
    if (typeof passcode !== 'string' || passcode.trim().toLowerCase() !== PASSCODE) {
      return res.status(403).json({ error: 'Wrong passcode' });
    }
    if (typeof content !== 'string' || content.length > MAX_LEN) {
      return res.status(400).json({ error: 'Bad content' });
    }
    await kv.set(KEY, content);
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end();
}
