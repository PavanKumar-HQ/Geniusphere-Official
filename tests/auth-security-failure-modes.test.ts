/**
 * Geniusphere — Production Authentication & Authorization Security Verification Suite
 * Verifies all 8 critical auth failure modes required by Production Evidence Gate:
 * 1. Valid active account authentication
 * 2. Suspended accounts with previously issued tokens
 * 3. Missing / deleted account token rejection (fail-closed)
 * 4. Malformed JWT rejection
 * 5. Expired JWT rejection
 * 6. Incorrectly signed JWT rejection
 * 7. WebSocket rejects suspended accounts with Close Code 4003
 * 8. Administrative telemetry rejects non-superadmins with HTTP 403
 */

import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { WebSocket } from 'ws';
import { generateToken, UserSessionPayload } from '../server/auth';
import { query } from '../server/db';
import { config } from '../server/config';

describe('Auth & Authorization Security Gate — Failure Modes & Fail-Closed Enforcement', () => {
  const activeStudent: UserSessionPayload = {
    userId: '11111111-1111-1111-1111-111111111111',
    email: 'learner@geniusphere.tech',
    fullName: 'Pavan Kumar',
    isSuperadmin: false,
    role: 'learner',
  };

  const validToken = generateToken(activeStudent);

  // ------------------------------------------------------------------
  // 1. Valid Active Account
  // ------------------------------------------------------------------
  it('1. Authorizes valid active account with HTTP 200 on protected endpoint', async () => {
    const res = await fetch('http://localhost:3001/api/profile', {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.personalInfo.email).toBe(activeStudent.email);
  });

  // ------------------------------------------------------------------
  // 2. Suspended Account with Previously Issued Token
  // ------------------------------------------------------------------
  it('2. Fails closed and rejects suspended user with HTTP 403 Forbidden', async () => {
    // A. Role-based suspended token
    const suspendedRoleToken = generateToken({
      ...activeStudent,
      role: 'suspended',
    });
    const resRole = await fetch('http://localhost:3001/api/profile', {
      headers: { Authorization: `Bearer ${suspendedRoleToken}` },
    });
    expect(resRole.status).toBe(403);
    const roleBody = await resRole.json();
    expect(roleBody.error).toContain('Account is suspended');

    // B. Database-authoritative suspension test
    // Create temporary test user, suspend in DB, test rejection, then clean up
    const tempUserId = '77777777-7777-7777-7777-777777777777';
    await query(
      `INSERT INTO public.users (id, email, full_name, date_of_birth, account_status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET account_status = 'suspended'`,
      [tempUserId, 'temp.suspended@geniusphere.tech', 'Temp Suspended', '2000-01-01', 'suspended']
    );

    try {
      const tempToken = generateToken({
        userId: tempUserId,
        email: 'temp.suspended@geniusphere.tech',
        fullName: 'Temp Suspended',
        isSuperadmin: false,
        role: 'learner',
      });

      const resDb = await fetch('http://localhost:3001/api/profile', {
        headers: { Authorization: `Bearer ${tempToken}` },
      });
      expect(resDb.status).toBe(403);
      const dbBody = await resDb.json();
      expect(dbBody.error).toContain('Account is suspended');
    } finally {
      await query(`DELETE FROM public.users WHERE id = $1`, [tempUserId]);
    }
  });

  // ------------------------------------------------------------------
  // 3. Missing / Deleted Account (Fail-Closed)
  // ------------------------------------------------------------------
  it('3. Fails closed and rejects missing or deleted user accounts with HTTP 401', async () => {
    const nonExistentUserId = '00000000-0000-0000-0000-000000000000';
    const phantomToken = generateToken({
      userId: nonExistentUserId,
      email: 'phantom@geniusphere.tech',
      fullName: 'Phantom User',
      isSuperadmin: false,
      role: 'learner',
    });

    const res = await fetch('http://localhost:3001/api/profile', {
      headers: { Authorization: `Bearer ${phantomToken}` },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain('Account not found or deactivated');
  });

  // ------------------------------------------------------------------
  // 4. Malformed JWT
  // ------------------------------------------------------------------
  it('4. Rejects malformed JWT strings with HTTP 401 Unauthorized', async () => {
    const res = await fetch('http://localhost:3001/api/profile', {
      headers: { Authorization: 'Bearer this.is.not.a.valid.jwt' },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain('Invalid or expired');
  });

  // ------------------------------------------------------------------
  // 5. Expired JWT
  // ------------------------------------------------------------------
  it('5. Rejects expired JWT tokens with HTTP 401 Unauthorized', async () => {
    const expiredToken = jwt.sign(
      {
        userId: activeStudent.userId,
        email: activeStudent.email,
        fullName: activeStudent.fullName,
        isSuperadmin: false,
        role: 'learner',
      },
      config.jwtSecret,
      { expiresIn: '-1s' } // Expired 1 second ago
    );

    const res = await fetch('http://localhost:3001/api/profile', {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    expect(res.status).toBe(401);
  });

  // ------------------------------------------------------------------
  // 6. Incorrectly Signed JWT (Forged Signature)
  // ------------------------------------------------------------------
  it('6. Rejects tokens signed with wrong secret key with HTTP 401 Unauthorized', async () => {
    const forgedToken = jwt.sign(
      {
        userId: activeStudent.userId,
        email: activeStudent.email,
        fullName: activeStudent.fullName,
        isSuperadmin: true,
        role: 'superadmin',
      },
      'attacker-unauthorized-secret-key-123456789'
    );

    const res = await fetch('http://localhost:3001/api/profile', {
      headers: { Authorization: `Bearer ${forgedToken}` },
    });
    expect(res.status).toBe(401);
  });

  // ------------------------------------------------------------------
  // 7. WebSocket Rejects Suspended Accounts with Close Code 4003
  // ------------------------------------------------------------------
  it('7. Enforces WebSocket connection rejection for suspended users (Code 4003)', async () => {
    const suspendedWsToken = generateToken({
      ...activeStudent,
      role: 'suspended',
    });

    const ws = new WebSocket(`ws://localhost:3001/ws?token=${suspendedWsToken}`);

    const closeCode = await new Promise<number>((resolve) => {
      ws.on('close', (code) => {
        resolve(code);
      });
      ws.on('error', () => {
        // Ignored
      });
    });

    expect(closeCode).toBe(4003);
  });

  // ------------------------------------------------------------------
  // 8. Server-Side Administrative Role Enforcement
  // ------------------------------------------------------------------
  it('8. Enforces server-side administrative role checks on control-plane telemetry', async () => {
    // Non-superadmin learner
    const learnerRes = await fetch('http://localhost:3001/api/control-plane/telemetry', {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    expect(learnerRes.status).toBe(403);

    // Canonical superadmin
    const superadminToken = generateToken({
      userId: '66666666-6666-6666-6666-666666666666',
      email: 'admin@geniusphere.tech',
      fullName: 'System Superadmin',
      isSuperadmin: true,
      role: 'superadmin',
    });

    const adminRes = await fetch('http://localhost:3001/api/control-plane/telemetry', {
      headers: { Authorization: `Bearer ${superadminToken}` },
    });
    expect(adminRes.status).toBe(200);
    const telemetry = await adminRes.json();
    expect(telemetry.server.name).toBe('geniusphere-backend-production');
  });
});
