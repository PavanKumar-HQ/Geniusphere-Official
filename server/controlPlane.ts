/**
 * Geniusphere Operational Control Plane & System Lifecycle Manager
 * Implements whole-system lifecycle transitions (starting, ready, degraded, draining, stopped),
 * liveness and readiness probes, resource telemetry, and coordinated graceful shutdown.
 */

import { FastifyInstance } from 'fastify';
import { pool, query } from './db';
import { outboxWorker } from './services/outboxWorker';
import { wsGateway } from './services/websocketGateway';
import { config } from './config';
import { AIProviderRegistry } from './ai/provider';

export type LifecycleState = 'starting' | 'ready' | 'degraded' | 'draining' | 'stopped' | 'failed';

export interface SubsystemStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  details?: Record<string, any>;
}

export interface ControlPlaneTelemetry {
  server: {
    name: string;
    version: string;
    lifecycleState: LifecycleState;
    uptimeSeconds: number;
    nodeVersion: string;
    pid: number;
  };
  resources: {
    memory: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
      externalMb: number;
    };
    databasePool: {
      totalConnections: number;
      idleConnections: number;
      waitingRequests: number;
      maxConnections: number;
    };
  };
  workloads: {
    outboxQueue: {
      running: boolean;
      pending: number;
      published: number;
      failed: number;
    };
    activeWebSocketClients: number;
  };
  aiGateway: {
    activeProvider: string;
    model: string;
    available: boolean;
    timeoutMs: number;
  };
}

export class SystemLifecycleManager {
  private static instance: SystemLifecycleManager;
  private state: LifecycleState = 'starting';
  private startedAt: number = Date.now();
  private fastifyApp: FastifyInstance | null = null;
  private isShuttingDown: boolean = false;

  private constructor() {}

  public static getInstance(): SystemLifecycleManager {
    if (!SystemLifecycleManager.instance) {
      SystemLifecycleManager.instance = new SystemLifecycleManager();
    }
    return SystemLifecycleManager.instance;
  }

  public registerApp(app: FastifyInstance): void {
    this.fastifyApp = app;
  }

  public setState(newState: LifecycleState): void {
    console.log(`[Lifecycle] State transition: ${this.state} -> ${newState}`);
    this.state = newState;
  }

  public getState(): LifecycleState {
    return this.state;
  }

  /**
   * Fast process liveness probe for container orchestrator.
   * Succeeds as long as process is alive and not shutting down.
   */
  public getLiveness(): { status: string; state: LifecycleState; timestamp: string } {
    const isAlive = this.state !== 'stopped' && this.state !== 'draining';
    return {
      status: isAlive ? 'alive' : 'draining',
      state: this.state,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Deep readiness probe: tests PostgreSQL database and background dependencies.
   */
  public async getReadiness(): Promise<{
    ready: boolean;
    state: LifecycleState;
    subsystems: SubsystemStatus[];
    timestamp: string;
  }> {
    const subsystems: SubsystemStatus[] = [];
    let isDbHealthy = false;

    // 1. Check PostgreSQL Database
    try {
      const dbRes = await query('SELECT 1 as ping');
      if (dbRes.rows[0]?.ping === 1) {
        isDbHealthy = true;
        subsystems.push({
          name: 'postgresql',
          status: 'healthy',
          details: {
            totalConnections: pool.totalCount,
            idleConnections: pool.idleCount,
            waitingRequests: pool.waitingCount,
          },
        });
      }
    } catch (err: any) {
      subsystems.push({
        name: 'postgresql',
        status: 'unhealthy',
        details: { error: err?.message || 'Database unreachable' },
      });
    }

    // 2. Check Background Outbox Worker
    const isWorkerRunning = outboxWorker.isRunning();
    subsystems.push({
      name: 'outboxWorker',
      status: isWorkerRunning ? 'healthy' : 'degraded',
      details: { running: isWorkerRunning },
    });

    // 3. Check AI Gateway Provider
    const providerName = config.aiProvider || 'none';
    let provider = null;
    try {
      provider = AIProviderRegistry.getProvider();
    } catch {
      provider = null;
    }
    let aiAvailable = false;
    if (provider && typeof provider.checkAvailability === 'function') {
      try {
        const probe = await provider.checkAvailability();
        aiAvailable = probe.available;
      } catch {
        aiAvailable = false;
      }
    }

    subsystems.push({
      name: 'aiGateway',
      status: providerName === 'none' || aiAvailable ? 'healthy' : 'degraded',
      details: {
        provider: providerName,
        available: aiAvailable,
      },
    });

    const isReady = isDbHealthy && this.state !== 'draining' && this.state !== 'stopped';

    // Update internal state
    if (isReady && this.state === 'starting') {
      this.state = 'ready';
    } else if (!isDbHealthy && this.state === 'ready') {
      this.state = 'degraded';
    }

    return {
      ready: isReady,
      state: this.state,
      subsystems,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Returns operational control plane telemetry for administrator dashboards and alerts.
   */
  public async getControlPlaneTelemetry(): Promise<ControlPlaneTelemetry> {
    const mem = process.memoryUsage();
    const queueStats = await outboxWorker.getQueueStats();
    const providerName = config.aiProvider || 'none';
    let provider = null;
    try {
      provider = AIProviderRegistry.getProvider();
    } catch {
      provider = null;
    }
    let aiAvailable = false;
    if (provider && typeof provider.checkAvailability === 'function') {
      try {
        const probe = await provider.checkAvailability();
        aiAvailable = probe.available;
      } catch {
        aiAvailable = false;
      }
    }

    return {
      server: {
        name: 'geniusphere-backend-production',
        version: '2.0.0',
        lifecycleState: this.state,
        uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
        nodeVersion: process.version,
        pid: process.pid,
      },
      resources: {
        memory: {
          rssMb: Math.round((mem.rss / (1024 * 1024)) * 10) / 10,
          heapUsedMb: Math.round((mem.heapUsed / (1024 * 1024)) * 10) / 10,
          heapTotalMb: Math.round((mem.heapTotal / (1024 * 1024)) * 10) / 10,
          externalMb: Math.round((mem.external / (1024 * 1024)) * 10) / 10,
        },
        databasePool: {
          totalConnections: pool.totalCount,
          idleConnections: pool.idleCount,
          waitingRequests: pool.waitingCount,
          maxConnections: 20,
        },
      },
      workloads: {
        outboxQueue: {
          running: outboxWorker.isRunning(),
          ...queueStats,
        },
        activeWebSocketClients: wsGateway.getConnectedUserCount(),
      },
      aiGateway: {
        activeProvider: providerName,
        model: config.aiModel || 'llama3.2',
        available: aiAvailable,
        timeoutMs: config.aiRequestTimeoutMs || 15000,
      },
    };
  }

  /**
   * Executes coordinated, deterministic graceful shutdown:
   * 1. Transitions lifecycle to 'draining'.
   * 2. Halts new background job ingestion.
   * 3. Closes Fastify HTTP/WSS server.
   * 4. Closes PostgreSQL connection pool.
   * 5. Transitions lifecycle to 'stopped'.
   */
  public async gracefulShutdown(signal: string = 'SIGTERM'): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log(`[Lifecycle] Received ${signal}. Commencing coordinated graceful shutdown...`);
    this.setState('draining');

    // 1. Stop background workers
    try {
      outboxWorker.stop();
      console.log('[Lifecycle] Background outbox worker stopped successfully.');
    } catch (err) {
      console.error('[Lifecycle] Error stopping outbox worker:', err);
    }

    try {
      wsGateway.stopHeartbeat();
      console.log('[Lifecycle] WebSocket heartbeat loop stopped successfully.');
    } catch (err) {
      console.error('[Lifecycle] Error stopping WebSocket heartbeat:', err);
    }

    // 2. Close Fastify Server (stops accepting new connections, allows in-flight requests to complete)
    if (this.fastifyApp) {
      try {
        await this.fastifyApp.close();
        console.log('[Lifecycle] Fastify HTTP/WSS server closed.');
      } catch (err) {
        console.error('[Lifecycle] Error closing Fastify server:', err);
      }
    }

    // 3. Drain and close PostgreSQL connection pool
    try {
      await pool.end();
      console.log('[Lifecycle] PostgreSQL connection pool drained and terminated.');
    } catch (err) {
      console.error('[Lifecycle] Error closing database pool:', err);
    }

    this.setState('stopped');
    console.log('[Lifecycle] Geniusphere backend terminated cleanly.');
  }
}

export const lifecycleManager = SystemLifecycleManager.getInstance();
