# Windows Web Server

Backend server for Windows 11 Virtual Lab providing terminal execution and filesystem management.

## Features

- **Terminal Execution**: WebSocket-based terminal with PowerShell/CMD simulation
- **Virtual Filesystem**: In-memory filesystem with optional SQLite persistence
- **Session Management**: Multi-user sessions with automatic cleanup
- **Network Simulation**: Simulated network commands (ping, ipconfig, etc.)
- **RESTful API**: Filesystem operations via REST endpoints

## Architecture

```
src/
├── index.ts                 # Main server entry point
├── types/                   # TypeScript type definitions
├── terminal/
│   ├── TerminalManager.ts   # Session management
│   ├── CommandExecutor.ts   # Command routing
│   └── commands/            # Command implementations
│       ├── filesystem.ts    # File operations
│       ├── network.ts       # Network commands
│       ├── process.ts       # Process management
│       ├── system.ts        # System info
│       └── utility.ts       # Utility commands
├── filesystem/
│   └── InMemoryFilesystemManager.ts  # Filesystem manager
└── routes/
    └── filesystem.ts        # REST API routes
```

## Installation

```bash
cd apps/WindowsWeb/server
pnpm install
```

## Configuration

Create `.env` file:

```env
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
SESSION_TIMEOUT_MS=3600000
FILESYSTEM_DB_PATH=./data/filesystem.db
SIMULATE_NETWORK=true
```

## Development

```bash
# Start dev server with hot reload
pnpm dev

# Build
pnpm build

# Start production server
pnpm start
```

## API Endpoints

### Health Check
```
GET /health
Response: { status: 'ok', timestamp: '...' }
```

### Filesystem API

```
GET /api/fs/info?path=<path>
GET /api/fs/list?path=<path>
POST /api/fs/file { path, content }
POST /api/fs/directory { path }
DELETE /api/fs/ { path, recursive }
```

## WebSocket Events

### Client → Server

**create-terminal-session**
```javascript
socket.emit('create-terminal-session', {
  shell: 'powershell' | 'cmd',
  sessionId: 'optional-id'
});
```

**terminal-input**
```javascript
socket.emit('terminal-input', {
  sessionId: 'session-id',
  input: 'dir'
});
```

**terminal-resize**
```javascript
socket.emit('terminal-resize', {
  sessionId: 'session-id',
  cols: 80,
  rows: 24
});
```

**destroy-terminal-session**
```javascript
socket.emit('destroy-terminal-session', {
  sessionId: 'session-id'
});
```

### Server → Client

**terminal-ready**
```javascript
socket.on('terminal-ready', (data) => {
  // data: { sessionId, shell }
});
```

**terminal-output**
```javascript
socket.on('terminal-output', (output) => {
  // output: string
});
```

**terminal-error**
```javascript
socket.on('terminal-error', (error) => {
  // error: { message }
});
```

## Supported Commands

### Filesystem
- `cd`, `chdir`, `Set-Location`
- `dir`, `ls`, `Get-ChildItem`
- `mkdir`, `md`, `New-Item`
- `copy`, `cp`, `Copy-Item`
- `move`, `mv`, `Move-Item`
- `del`, `rm`, `Remove-Item`
- `type`, `cat`, `Get-Content`

### Network
- `ping <host>`
- `ipconfig [/all]`
- `tracert <host>`
- `net share [name] [path]`
- `net use [drive] [path]`

### Process (PowerShell)
- `Get-Process [-Name <name>]`
- `Stop-Process -Name <name>`

### System
- `systeminfo`
- `hostname`

### Utility
- `echo`, `Write-Output`
- `cls`, `clear`
- `help`
- `exit`

## Adding New Commands

1. Create command file in `src/terminal/commands/`
2. Implement command function with signature:
   ```typescript
   export async function myCommand(
     args: string[],
     session: TerminalSession,
     fs?: InMemoryFilesystemManager
   ): Promise<ExecutionResult>
   ```
3. Export from `src/terminal/commands/index.ts`
4. Add routing in `CommandExecutor.ts`

## Testing

```bash
# Manual testing with curl
curl http://localhost:3001/health

# WebSocket testing with wscat
wscat -c ws://localhost:3001
> {"type":"create-terminal-session","data":{"shell":"powershell"}}
```

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://your-domain.com
SESSION_TIMEOUT_MS=1800000
```

### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start dist/index.js --name windows-web-server
pm2 save
pm2 startup
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

```bash
docker build -t windows-web-server .
docker run -p 3001:3001 -e PORT=3001 windows-web-server
```

## Performance

- **Concurrent Sessions**: Supports 100+ concurrent terminal sessions
- **Memory**: ~50MB base + ~2MB per active session
- **CPU**: Minimal (command simulation, no actual process execution)

## Security

- ✅ No actual OS command execution (sandboxed simulation)
- ✅ Input validation on all commands
- ✅ Session isolation (each user has separate filesystem)
- ✅ CORS protection
- ⚠️ Add rate limiting for production
- ⚠️ Add authentication middleware for production

## Troubleshooting

**Port already in use:**
```bash
lsof -ti:3001 | xargs kill -9
```

**WebSocket connection failed:**
- Check CORS settings
- Verify client URL matches ALLOWED_ORIGINS
- Check firewall rules

**Commands not executing:**
- Check terminal session exists
- Verify command is registered in CommandExecutor
- Check server logs for errors

## License

See root LICENSE file.
