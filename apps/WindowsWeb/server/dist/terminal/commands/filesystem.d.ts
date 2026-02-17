import { ExecutionResult } from '../CommandExecutor';
import { TerminalSession } from '../TerminalManager';
import { InMemoryFilesystemManager } from '../../filesystem/InMemoryFilesystemManager';
export declare function cd(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult>;
export declare function dir(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult>;
export declare function mkdir(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult>;
export declare function copy(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult>;
export declare function move(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult>;
export declare function del(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult>;
export declare function type(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult>;
//# sourceMappingURL=filesystem.d.ts.map