import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { parse } from 'url';
import cookie from 'cookie';
import signature from 'cookie-signature';
import type { Notification } from '@shared/schema';

// Map of userId -> Set of WebSocket connections
const userConnections = new Map<string, Set<WebSocket>>();

export function initNotificationGateway(httpServer: HTTPServer, sessionStore: any) {
  const wss = new WebSocketServer({ noServer: true });

  // Handle upgrade requests
  httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url || '');
    
    if (pathname !== '/ws/notifications') {
      socket.destroy();
      return;
    }

    // Parse cookies
    const cookies = cookie.parse(request.headers.cookie || '');
    const sessionCookie = cookies['connect.sid'];
    
    if (!sessionCookie) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // Verify and extract session ID from signed cookie
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      console.error("SESSION_SECRET is not set (WebSocket auth cannot verify sessions)");
      socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
      socket.destroy();
      return;
    }
    const unsignedValue = signature.unsign(sessionCookie.slice(2), secret); // Remove 's:' prefix

    if (unsignedValue === false) {
      console.error('Invalid session signature');
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    const sessionId = unsignedValue;

    // Retrieve session
    sessionStore.get(sessionId, (err: any, session: any) => {
      if (err || !session || !session.userId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      const userId = session.userId;

      wss.handleUpgrade(request, socket, head, (ws: WebSocket & { userId?: string }) => {
        ws.userId = userId;
        wss.emit('connection', ws, request, userId);
      });
    });
  });

  // Handle WebSocket connections
  wss.on('connection', (ws: WebSocket & { userId?: string; isAlive?: boolean }, _request: any, userId: string) => {
    console.log(`WebSocket connected for user ${userId}`);

    // Initialize connection state
    ws.isAlive = true;

    // Add connection to user's set
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId)!.add(ws);

    // Handle ping/pong for keep-alive
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Handle messages (optional - for client acknowledgments)
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`Message from ${userId}:`, message);
      } catch (error) {
        console.error('Invalid message format:', error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log(`WebSocket disconnected for user ${userId}`);
      const connections = userConnections.get(userId);
      if (connections) {
        connections.delete(ws);
        if (connections.size === 0) {
          userConnections.delete(userId);
        }
      }
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
      const connections = userConnections.get(userId);
      if (connections) {
        connections.delete(ws);
        if (connections.size === 0) {
          userConnections.delete(userId);
        }
      }
    });

    // Send initial connection success message
    ws.send(JSON.stringify({ type: 'connected', userId }));
  });

  // Heartbeat interval to detect dead connections
  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws: WebSocket & { isAlive?: boolean }) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(heartbeat);
  });

  return wss;
}

// Publish notification to connected users
export function publishNotification(notification: Notification): void {
  try {
    const connections = userConnections.get(notification.userId);
    
    if (connections && connections.size > 0) {
      const message = JSON.stringify({
        type: 'notification',
        notification,
      });

      const deadSockets: WebSocket[] = [];

      connections.forEach((ws) => {
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
          } else {
            deadSockets.push(ws);
          }
        } catch (error) {
          console.error(`Failed to send notification to WebSocket:`, error);
          deadSockets.push(ws);
        }
      });

      // Clean up dead sockets
      deadSockets.forEach((ws) => connections.delete(ws));
      if (connections.size === 0) {
        userConnections.delete(notification.userId);
      }

      console.log(`Notification published to ${connections.size - deadSockets.length}/${connections.size} connection(s) for user ${notification.userId}`);
    } else {
      console.log(`No active connections for user ${notification.userId}, notification persisted only`);
    }
  } catch (error) {
    console.error(`Failed to publish notification:`, error, notification);
  }
}

// Broadcast to all users of a team
export function broadcastToTeam(teamId: string, notification: Omit<Notification, 'id' | 'userId' | 'createdAt'>): void {
  // This will be used when we have team-wide notifications
  // For now, we'll implement this when needed
  console.log(`Team broadcast to ${teamId}:`, notification);
}

// Helper to create and immediately publish a notification
export async function createAndPublishNotification(
  createFn: () => Promise<Notification>
): Promise<Notification> {
  const notification = await createFn();
  publishNotification(notification);
  return notification;
}

declare module 'ws' {
  interface WebSocket {
    userId?: string;
    isAlive?: boolean;
  }
}
