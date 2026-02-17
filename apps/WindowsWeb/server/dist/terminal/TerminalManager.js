"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalManager = void 0;
const events_1 = require("events");
const pty = __importStar(require("node-pty"));
class TerminalManager extends events_1.EventEmitter {
    constructor(filesystemManager) {
        super();
        this.sessions = new Map();
        this.outputCallbacks = new Map();
        this.filesystemManager = filesystemManager;
    }
    // Get the shell executable path based on OS
    getShellPath(shell) {
        if (process.platform === 'win32') {
            if (shell === 'powershell') {
                return 'powershell.exe';
            }
            else {
                return 'cmd.exe';
            }
        }
        else {
            return shell === 'powershell' ? 'pwsh' : 'bash';
        }
    }
    async createSession(sessionId, shell, outputCallback) {
        console.log(`[TerminalManager] Creating session ${sessionId} with shell ${shell}`);
        // Store output callback for this session
        this.outputCallbacks.set(sessionId, outputCallback);
        const existingSession = this.sessions.get(sessionId);
        if (existingSession) {
            console.log(`[TerminalManager] Session ${sessionId} already exists, reusing`);
            existingSession.lastActivity = Date.now();
            return existingSession;
        }
        // Determine starting directory
        const startDir = process.env.USERPROFILE || process.env.HOME || 'C:\\Users\\Manoj';
        // Shell command and args
        const shellPath = this.getShellPath(shell);
        let shellArgs;
        if (shell === 'powershell') {
            // Remove -NoLogo to show the PowerShell banner
            shellArgs = ['-NoExit', '-ExecutionPolicy', 'Bypass'];
        }
        else {
            // Use /K to keep CMD open and show version banner
            shellArgs = ['/K'];
        }
        console.log(`[TerminalManager] Spawning shell with node-pty: ${shellPath} ${shellArgs.join(' ')}`);
        let ptyProcess = null;
        try {
            // Use node-pty for proper TTY handling
            ptyProcess = pty.spawn(shellPath, shellArgs, {
                name: 'xterm-256color',
                cols: 80,
                rows: 24,
                cwd: startDir,
                env: {
                    ...process.env,
                    TERM: 'xterm-256color',
                    COLORTERM: 'truecolor',
                },
                useConpty: process.platform === 'win32', // Use Windows ConPTY API on Windows 10+
            });
            console.log(`[TerminalManager] PTY process created with PID: ${ptyProcess.pid}`);
            // Handle data from pty
            ptyProcess.onData((data) => {
                console.log(`[TerminalManager] PTY data: ${JSON.stringify(data.substring(0, 100))}`);
                // Send output to client
                const callback = this.outputCallbacks.get(sessionId);
                if (callback) {
                    callback(data);
                }
            });
            // Handle pty exit
            ptyProcess.onExit(({ exitCode, signal }) => {
                console.log(`[TerminalManager] PTY process exited with code ${exitCode}, signal ${signal}`);
                this.destroySession(sessionId);
            });
            console.log(`[TerminalManager] Shell process started for session ${sessionId}: ${shellPath}`);
        }
        catch (error) {
            console.error('[TerminalManager] Failed to create PTY process:', error);
            // Send error message to client
            setTimeout(() => {
                const callback = this.outputCallbacks.get(sessionId);
                if (callback) {
                    callback(`\r\nError: Failed to start terminal - ${error.message}\r\n`);
                }
            }, 100);
        }
        const session = {
            id: sessionId,
            shell,
            ptyProcess,
            currentDirectory: startDir,
            lastActivity: Date.now(),
            history: [],
            inputBuffer: '',
            cols: 80,
            rows: 24,
            environmentVariables: {
                COMPUTERNAME: 'WIN11-PC',
                USERNAME: 'Manoj',
                USERDOMAIN: 'WIN11-PC',
                HOME: startDir,
                HOMEDRIVE: 'C:',
                HOMEPATH: '\\Users\\Manoj',
                SystemDrive: 'C:',
                SystemRoot: 'C:\\Windows',
                WINDIR: 'C:\\Windows',
                PATH: 'C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem',
                PATHEXT: '.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC',
                PROCESSOR_ARCHITECTURE: 'x86_64',
                PROCESSOR_IDENTIFIER: 'Intel64 Family 6 Model 142 Stepping 12 GenuineIntel',
                TEMP: 'C:\\Users\\Manoj\\AppData\\Local\\Temp',
                TMP: 'C:\\Users\\Manoj\\AppData\\Local\\Temp',
            },
        };
        this.sessions.set(sessionId, session);
        return session;
    }
    async handleInput(sessionId, input) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            console.error(`[TerminalManager] Session ${sessionId} not found`);
            throw new Error(`Session ${sessionId} not found`);
        }
        console.log(`[TerminalManager] Handling input for ${sessionId}: ${JSON.stringify(input)}`);
        session.lastActivity = Date.now();
        // Track Enter key presses for history
        if (input === '\r' || input === '\n' || input === '\r\n') {
            if (session.inputBuffer.trim()) {
                session.history.push(session.inputBuffer.trim());
                session.inputBuffer = '';
            }
        }
        else if (input.charCodeAt(0) === 127 || input.charCodeAt(0) === 8) {
            // Backspace
            session.inputBuffer = session.inputBuffer.slice(0, -1);
        }
        else if (input.charCodeAt(0) >= 32 && input.charCodeAt(0) <= 126) {
            // Printable characters
            session.inputBuffer += input;
        }
        if (session.ptyProcess) {
            // Write to the PTY process
            try {
                session.ptyProcess.write(input);
                console.log(`[TerminalManager] Wrote ${input.length} bytes to PTY`);
            }
            catch (error) {
                console.error(`[TerminalManager] Failed to write to PTY: ${error}`);
            }
        }
        else {
            console.error(`[TerminalManager] No PTY process for session ${sessionId}`);
            const callback = this.outputCallbacks.get(sessionId);
            if (callback) {
                callback('\r\nError: Terminal process not available\r\n');
            }
        }
    }
    resizeTerminal(sessionId, cols, rows) {
        const session = this.sessions.get(sessionId);
        if (session && session.ptyProcess) {
            try {
                session.ptyProcess.resize(cols, rows);
                session.cols = cols;
                session.rows = rows;
                console.log(`[TerminalManager] Resized session ${sessionId} to ${cols}x${rows}`);
            }
            catch (error) {
                console.error(`[TerminalManager] Failed to resize PTY: ${error}`);
            }
        }
        session && (session.lastActivity = Date.now());
    }
    destroySession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            if (session.ptyProcess) {
                try {
                    session.ptyProcess.kill();
                }
                catch (e) {
                    // Process might already be dead
                }
                session.ptyProcess = null;
            }
            this.sessions.delete(sessionId);
            this.outputCallbacks.delete(sessionId);
            this.emit('session-destroyed', sessionId);
            console.log(`[TerminalManager] Session ${sessionId} destroyed`);
        }
    }
    destroyAllSessions() {
        const sessionIds = Array.from(this.sessions.keys());
        sessionIds.forEach((id) => this.destroySession(id));
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    getHistoryItem(sessionId, index) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const reversedIndex = session.history.length - 1 - index;
        if (reversedIndex >= 0 && reversedIndex < session.history.length) {
            return session.history[reversedIndex] ?? null;
        }
        return null;
    }
    getHistorySize(sessionId) {
        const session = this.sessions.get(sessionId);
        return session ? session.history.length : 0;
    }
    complete(sessionId, input) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return [];
        return this.filesystemManager.completePath(input, session.currentDirectory);
    }
    getPrompt(session) {
        if (session.shell === 'powershell') {
            return `\r\nPS ${session.currentDirectory}> `;
        }
        else {
            return `\r\n${session.currentDirectory}> `;
        }
    }
    cleanupIdleSessions(timeoutMs) {
        const now = Date.now();
        const sessionIds = Array.from(this.sessions.keys());
        for (const sessionId of sessionIds) {
            const session = this.sessions.get(sessionId);
            if (session && (now - session.lastActivity) > timeoutMs) {
                console.log(`[TerminalManager] Cleaning up idle session ${sessionId}`);
                this.destroySession(sessionId);
            }
        }
    }
}
exports.TerminalManager = TerminalManager;
//# sourceMappingURL=TerminalManager.js.map