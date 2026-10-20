import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { FastifyRequest, FastifyReply } from 'fastify';
import { config } from './config';
import { query } from './db';

export interface UserSessionPayload {
  userId: string;
  email: string;
  fullName: string;
  isSuperadmin: boolean;
  orgId?: string;
  role?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserSessionPayload;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: UserSessionPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string): UserSessionPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as UserSessionPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Fastify authentication middleware preHandler
 */
export async function authenticateRequest(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    reply.status(401).send({ error: 'Invalid or expired authorization token' });
    return;
  }

  // Set PostgreSQL session context for RLS in subsequent queries
  try {
    await query(`SELECT set_config('request.jwt.claim.sub', $1, true)`, [payload.userId]);
  } catch (err) {
    // Non-fatal if connection is pooled
  }

  request.user = payload;
}

/**
 * Role-based access control guard
 */
export function requireRoles(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      reply.status(401).send({ error: 'Authentication required' });
      return;
    }
    if (request.user.isSuperadmin) return;

    if (!request.user.role || !roles.includes(request.user.role)) {
      reply.status(403).send({
        error: `Forbidden: requires one of roles [${roles.join(', ')}]`,
      });
      return;
    }
  };
}
