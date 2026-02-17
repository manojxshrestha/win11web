import { InMemoryFilesystemManager } from '../filesystem/InMemoryFilesystemManager';
import { TerminalSession } from './TerminalManager';
export interface ExecutionResult {
    output: string;
    error?: string;
    exitCode: number;
    newDirectory?: string;
    environmentChanges?: Map<string, string>;
}
export declare class CommandExecutor {
    private filesystemManager;
    private shell;
    constructor(filesystemManager: InMemoryFilesystemManager, shell: 'powershell' | 'cmd');
    execute(input: string, session: TerminalSession): Promise<ExecutionResult>;
    private parseCommand;
}
//# sourceMappingURL=CommandExecutor.d.ts.map