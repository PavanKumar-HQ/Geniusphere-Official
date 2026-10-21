import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../server/index';
import { generateToken, UserSessionPayload } from '../server/auth';
import { lifecycleManager } from '../server/controlPlane';

describe('Geniusphere Operational Control Plane & Lifecycle Verification', () => {
  let app: any;

  const superadmin: UserSessionPayload = {
    userId: '99999999-9999-9999-9999-999999999999',
    email: 'admin@geniusphere.tech',
    fullName: 'Platform Superadmin',
    isSuperadmin: true,
    role: 'superadmin',
  };

  const student: UserSessionPayload = {
    userId: '11111111-1111-1111-1111-111111111111',
    email: 'learner@geniusphere.tech',
    fullName: 'Pavan Kumar',
    isSuperadmin: false,
    role: 'learner',
  };

  const adminToken = generateToken(superadmin);
  const studentToken = generateToken(student);

  beforeAll(async () => {
    app = await createServer();
  });

  // ------------------------------------------------------------------
  // 1. Process Liveness Probe
  // ------------------------------------------------------------------
  it('1. GET /health/liveness returns HTTP 200 with alive status', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/health/liveness',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('alive');
    expect(body.timestamp).toBeDefined();
  });

  // ------------------------------------------------------------------
  // 2. Application Readiness Probe
  // ------------------------------------------------------------------
  it('2. GET /health/readiness returns HTTP 200 and subsystem statuses', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/health/readiness',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.ready).toBe(true);
    expect(body.subsystems).toBeInstanceOf(Array);

    const postgres = body.subsystems.find((s: any) => s.name === 'postgresql');
    expect(postgres).toBeDefined();
    expect(postgres.status).toBe('healthy');
    expect(postgres.details.totalConnections).toBeGreaterThanOrEqual(0);

    const outbox = body.subsystems.find((s: any) => s.name === 'outboxWorker');
    expect(outbox).toBeDefined();
  });

  // ------------------------------------------------------------------
  // 3. Operational Control Plane Telemetry Access Control
  // ------------------------------------------------------------------
  it('3. GET /api/control-plane/telemetry enforces role-based access control', async () => {
    // A. Unauthenticated request rejected
    const unauthRes = await app.inject({
      method: 'GET',
      url: '/api/control-plane/telemetry',
    });
    expect(unauthRes.statusCode).toBe(401);

    // B. Ordinary learner rejected with HTTP 403 Forbidden
    const studentRes = await app.inject({
      method: 'GET',
      url: '/api/control-plane/telemetry',
      headers: { authorization: `Bearer ${studentToken}` },
    });
    expect(studentRes.statusCode).toBe(403);
    const studentBody = JSON.parse(studentRes.body);
    expect(studentBody.error).toContain('Forbidden');

    // C. Superadmin authorized and receives complete operational telemetry
    const adminRes = await app.inject({
      method: 'GET',
      url: '/api/control-plane/telemetry',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(adminRes.statusCode).toBe(200);
    const telemetry = JSON.parse(adminRes.body);

    // Verify telemetry structure
    expect(telemetry.server.name).toBe('geniusphere-backend-production');
    expect(telemetry.server.version).toBe('2.0.0');
    expect(telemetry.server.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(telemetry.resources.memory.heapUsedMb).toBeGreaterThan(0);
    expect(telemetry.resources.databasePool.maxConnections).toBe(20);
    expect(telemetry.workloads.outboxQueue).toBeDefined();
    expect(telemetry.aiGateway).toBeDefined();
  });

  // ------------------------------------------------------------------
  // 4. Lifecycle Manager State Machine
  // ------------------------------------------------------------------
  it('4. Correctly transitions lifecycle states and reports accurately', () => {
    const originalState = lifecycleManager.getState();

    lifecycleManager.setState('ready');
    expect(lifecycleManager.getState()).toBe('ready');

    lifecycleManager.setState('degraded');
    expect(lifecycleManager.getState()).toBe('degraded');

    // Restore state
    lifecycleManager.setState(originalState);
  });
});
