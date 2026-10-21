import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { verifyToken, UserSessionPayload } from '../auth';

interface AuthenticatedSocket {
  ws: WebSocket;
  user: UserSessionPayload;
  channels: Set<string>;
}

class WebSocketGateway {
  private clients: Map<string, Set<AuthenticatedSocket>> = new Map(); // userId -> sockets

  public handleConnection(ws: WebSocket, req: IncomingMessage): void {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Authentication token required');
      return;
    }

    const user = verifyToken(token);
    if (!user) {
      ws.close(4002, 'Invalid or expired token');
      return;
    }

    if (user.role === 'suspended') {
      ws.close(4003, 'Account is suspended');
      return;
    }

    const socketRecord: AuthenticatedSocket = {
      ws,
      user,
      channels: new Set([`user:${user.userId}`, 'system:broadcast']),
    };

    if (user.orgId) {
      socketRecord.channels.add(`org:${user.orgId}`);
    }

    if (!this.clients.has(user.userId)) {
      this.clients.set(user.userId, new Set());
    }
    this.clients.get(user.userId)!.add(socketRecord);

    // Send connection ack
    ws.send(
      JSON.stringify({
        type: 'CONNECTION_ESTABLISHED',
        userId: user.userId,
        timestamp: new Date().toISOString(),
        channels: Array.from(socketRecord.channels),
      })
    );

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.action === 'SUBSCRIBE' && typeof msg.channel === 'string') {
          // Channel authorization check
          if (this.canSubscribe(user, msg.channel)) {
            socketRecord.channels.add(msg.channel);
            ws.send(JSON.stringify({ type: 'SUBSCRIBED', channel: msg.channel }));
          } else {
            ws.send(
              JSON.stringify({
                type: 'SUBSCRIPTION_DENIED',
                channel: msg.channel,
                error: 'Unauthorized channel access',
              })
            );
          }
        }
      } catch (err) {
        // ignore malformed client payloads
      }
    });

    ws.on('close', () => {
      const userSockets = this.clients.get(user.userId);
      if (userSockets) {
        userSockets.delete(socketRecord);
        if (userSockets.size === 0) {
          this.clients.delete(user.userId);
        }
      }
    });

    ws.on('error', () => {
      // socket error cleanup
    });
  }

  private canSubscribe(user: UserSessionPayload, channel: string): boolean {
    if (user.isSuperadmin) return true;
    if (channel === `user:${user.userId}`) return true;
    if (channel === 'system:broadcast') return true;
    if (user.orgId && channel === `org:${user.orgId}`) return true;
    if (channel.startsWith('course:')) return true; // Public or enrolled course updates
    return false;
  }

  /**
   * Broadcast an event to authorized clients
   */
  public broadcast(event: {
    event_id: string;
    event_type: string;
    payload: any;
    target_user_id?: string;
    target_channel?: string;
  }): void {
    const raw = JSON.stringify({
      type: 'DOMAIN_EVENT',
      eventId: event.event_id,
      eventType: event.event_type,
      payload: event.payload,
      timestamp: new Date().toISOString(),
    });

    if (event.target_user_id) {
      const userSockets = this.clients.get(event.target_user_id);
      if (userSockets) {
        for (const sock of userSockets) {
          if (sock.ws.readyState === WebSocket.OPEN) {
            sock.ws.send(raw);
          }
        }
      }
      return;
    }

    const channel = event.target_channel || 'system:broadcast';
    for (const sockets of this.clients.values()) {
      for (const sock of sockets) {
        if (sock.channels.has(channel) && sock.ws.readyState === WebSocket.OPEN) {
          sock.ws.send(raw);
        }
      }
    }
  }

  public getConnectedUserCount(): number {
    return this.clients.size;
  }
}

export const wsGateway = new WebSocketGateway();
