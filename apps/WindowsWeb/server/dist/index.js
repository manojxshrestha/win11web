"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const TerminalManager_1 = require("./terminal/TerminalManager");
const InMemoryFilesystemManager_1 = require("./filesystem/InMemoryFilesystemManager");
const filesystem_1 = __importDefault(require("./routes/filesystem"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
// Initialize managers
const filesystemManager = new InMemoryFilesystemManager_1.InMemoryFilesystemManager();
const terminalManager = new TerminalManager_1.TerminalManager(filesystemManager);
// REST API Routes
app.use('/api/fs', (0, filesystem_1.default)(filesystemManager));
// Browser Proxy Route - proxies requests to external websites
app.use('/api/proxy', (0, http_proxy_middleware_1.createProxyMiddleware)({
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
        const targetUrl = req.query.url;
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
    socket.on('create-terminal-session', async (data) => {
        try {
            const sessionId = data.sessionId || socket.id;
            await terminalManager.createSession(sessionId, data.shell, (output) => {
                socket.emit('terminal-output', output);
            });
            socket.emit('terminal-ready', { sessionId, shell: data.shell });
        }
        catch (error) {
            console.error('Error creating terminal session:', error);
            socket.emit('terminal-error', { message: 'Failed to create terminal session' });
        }
    });
    socket.on('terminal-input', async (data) => {
        try {
            // handleInput now handles output via callback, no result returned
            await terminalManager.handleInput(data.sessionId, data.input);
        }
        catch (error) {
            console.error('Error handling terminal input:', error);
            socket.emit('terminal-output', `\r\nError: ${(error instanceof Error ? error.message : String(error))}\r\n`);
        }
    });
    socket.on('terminal-resize', (data) => {
        terminalManager.resizeTerminal(data.sessionId, data.cols, data.rows);
    });
    socket.on('destroy-terminal-session', (data) => {
        terminalManager.destroySession(data.sessionId);
    });
    // History navigation handlers
    socket.on('get-history', (data) => {
        const session = terminalManager.getSession(data.sessionId);
        if (session) {
            socket.emit('history-response', {
                history: session.history,
                size: session.history.length
            });
        }
    });
    socket.on('navigate-history', (data) => {
        const session = terminalManager.getSession(data.sessionId);
        if (!session)
            return;
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
    socket.on('request-completion', (data) => {
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
//# sourceMappingURL=index.js.map