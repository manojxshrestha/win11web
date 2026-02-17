import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { TerminalManager } from './terminal/TerminalManager';
import { InMemoryFilesystemManager } from './filesystem/InMemoryFilesystemManager';
import filesystemRoutes from './routes/filesystem';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize managers
const filesystemManager = new InMemoryFilesystemManager();
const terminalManager = new TerminalManager(filesystemManager);

// REST API Routes
app.use('/api/fs', filesystemRoutes(filesystemManager));

// Browser Proxy Route - proxies requests to external websites
app.use('/api/proxy', createProxyMiddleware({
  changeOrigin: true,
  followRedirects: true,
  secure: false,
  onProxyReq: (proxyReq, req) => {
    // Remove headers that might cause issues
    proxyReq.removeHeader('x-frame-options');
    proxyReq.removeHeader('content-security-policy');
  },
  onProxyRes: (proxyRes) => {
    // Remove security headers that prevent iframe embedding
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['content-security-policy-report-only'];
    
    // Set headers to allow iframe embedding
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
  },
  router: (req) => {
    const targetUrl = req.query.url as string;
    if (targetUrl) {
      return targetUrl;
    }
    return 'http://localhost:3000';
  },
  pathRewrite: {
    '^/api/proxy': '',
  },
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket handling for terminal
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('create-terminal-session', async (data: { shell: 'powershell' | 'cmd'; sessionId?: string }) => {
    try {
      const sessionId = data.sessionId || socket.id;
      await terminalManager.createSession(sessionId, data.shell, (output) => {
        socket.emit('terminal-output', output);
      });

      socket.emit('terminal-ready', { sessionId, shell: data.shell });
    } catch (error) {
      console.error('Error creating terminal session:', error);
      socket.emit('terminal-error', { message: 'Failed to create terminal session' });
    }
  });

  socket.on('terminal-input', async (data: { sessionId: string; input: string }) => {
    try {
      // handleInput now handles output via callback, no result returned
      await terminalManager.handleInput(data.sessionId, data.input);
    } catch (error) {
      console.error('Error handling terminal input:', error);
      socket.emit('terminal-output', `\r\nError: ${(error instanceof Error ? error.message : String(error))}\r\n`);
    }
  });

  socket.on('terminal-resize', (data: { sessionId: string; cols: number; rows: number }) => {
    terminalManager.resizeTerminal(data.sessionId, data.cols, data.rows);
  });

  socket.on('destroy-terminal-session', (data: { sessionId: string }) => {
    terminalManager.destroySession(data.sessionId);
  });

  // History navigation handlers
  socket.on('get-history', (data: { sessionId: string }) => {
    const session = terminalManager.getSession(data.sessionId);
    if (session) {
      socket.emit('history-response', { 
        history: session.history,
        size: session.history.length 
      });
    }
  });

  socket.on('navigate-history', (data: { sessionId: string; direction: 'up' | 'down'; currentIndex: number }) => {
    const session = terminalManager.getSession(data.sessionId);
    if (!session) return;

    const history = session.history;
    const newIndex = data.direction === 'up' 
      ? Math.min(data.currentIndex + 1, history.length - 1)
      : Math.max(data.currentIndex - 1, 0);

    if (history.length > 0) {
      const item = history[history.length - 1 - newIndex];
      socket.emit('history-item', { item, index: newIndex });
    }
  });

  // Tab completion handler
  socket.on('request-completion', (data: { sessionId: string; input: string }) => {
    const completions = terminalManager.complete(data.sessionId, data.input);
    socket.emit('completion-response', { completions });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    terminalManager.destroySession(socket.id);
  });
});

// Cleanup idle sessions every 10 minutes
setInterval(() => {
  const timeout = parseInt(process.env.SESSION_TIMEOUT_MS || '3600000', 10);
  terminalManager.cleanupIdleSessions(timeout);
}, 600000);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Windows Web Server running on port ${PORT}`);
  console.log(`📁 Filesystem DB: ${process.env.FILESYSTEM_DB_PATH || './data/filesystem.db'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  terminalManager.destroyAllSessions();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
