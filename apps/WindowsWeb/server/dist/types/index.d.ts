export interface TerminalSession {
    id: string;
    shell: 'powershell' | 'cmd';
    currentDirectory: string;
    environmentVariables: Record<string, string>;
    history: string[];
    lastActivity: number;
    createdAt: number;
}
export interface CommandResult {
    output: string;
    exitCode: number;
    error?: string;
}
export interface FileSystemEntry {
    id: string;
    name: string;
    path: string;
    type: 'file' | 'directory';
    size: number;
    content?: string;
    parentId: string | null;
    createdAt: number;
    modifiedAt: number;
    attributes: {
        hidden: boolean;
        readOnly: boolean;
        system: boolean;
    };
    owner?: string;
    permissions?: string;
}
export interface NetworkShare {
    name: string;
    path: string;
    description?: string;
    permissions: string[];
}
export interface NetworkDrive {
    letter: string;
    remotePath: string;
    connected: boolean;
}
//# sourceMappingURL=index.d.ts.map