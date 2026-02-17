/// <reference types="node" />
import { EventEmitter } from 'events';
import * as pty from 'node-pty';
import { InMemoryFilesystemManager } from '../filesystem/InMemoryFilesystemManager';
export interface TerminalSession {
    id: string;
    shell: 'powershell' | 'cmd';
    ptyProcess: pty.IPty | null;
    currentDirectory: string;
    lastActivity: number;
    history: string[];
    inputBuffer: string;
    environmentVariables: Record<string, string>;
    cols: number;
    rows: number;
}
export declare class TerminalManager extends EventEmitter {
    private sessions;
    private filesystemManager;
    private outputCallbacks;
    constructor(filesystemManager: InMemoryFilesystemManager);
    private getShellPath;
    createSession(sessionId: string, shell: 'powershell' | 'cmd', outputCallback: (output: string) => void): Promise<TerminalSession>;
    handleInput(sessionId: string, input: string): Promise<void>;
    resizeTerminal(sessionId: string, cols: number, rows: number): void;
    destroySession(sessionId: string): void;
    destroyAllSessions(): void;
    getSession(sessionId: string): TerminalSession | undefined;
    getHistoryItem(sessionId: string, index: number): string | null;
    getHistorySize(sessionId: string): number;
    complete(sessionId: string, input: string): string[];
    getPrompt(session: TerminalSession): string;
    cleanupIdleSessions(timeoutMs: number): void;
}
//# sourceMappingURL=TerminalManager.d.ts.map