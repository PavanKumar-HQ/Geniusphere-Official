/**
 * Geniusphere AI Service — Vercel Serverless Function Entry Point
 * Routes: POST /api/v1/ai/chat
 */

import { handleAIChat } from '../../../server/ai/chatHandler';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Method Not Allowed. Only POST is supported.',
        },
      })
    );
    return;
  }

  // Parse body if Vercel did not automatically parse it
  let body = req.body;
  let rawBodyLength: number | undefined;

  if (typeof body === 'string') {
    rawBodyLength = Buffer.byteLength(body, 'utf8');
    try {
      body = JSON.parse(body);
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: {
            code: 'INVALID_JSON',
            message: 'Malformed JSON payload.',
          },
        })
      );
      return;
    }
  } else if (body && typeof body === 'object') {
    rawBodyLength = Buffer.byteLength(JSON.stringify(body), 'utf8');
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const result = await handleAIChat({
    headers: req.headers,
    body,
    rawBodyLength,
    ip,
  });

  for (const [key, value] of Object.entries(result.headers)) {
    res.setHeader(key, value);
  }

  res.statusCode = result.status;
  res.end(JSON.stringify(result.body));
}
