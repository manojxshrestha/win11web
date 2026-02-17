export interface FileNode {
    id: number;
    name: string;
    path: string;
    type: 'file' | 'directory';
    content?: string;
    size: number;
    createdAt: string;
    modifiedAt: string;
    parentId?: number;
}
export interface Share {
    name: string;
    path: string;
    description: string;
}
export declare class FilesystemManager {
    private db;
    constructor(dbPath?: string);
    private initializeDatabase;
    private seedDefaultStructure;
    createFile(filePath: string, content?: string): FileNode;
    createDirectory(dirPath: string): FileNode;
    getFile(filePath: string): FileNode | null;
    listDirectory(dirPath: string): FileNode[];
    deleteFile(filePath: string): boolean;
    deleteDirectory(dirPath: string, recursive?: boolean): boolean;
    moveFile(sourcePath: string, destPath: string): boolean;
    copyFile(sourcePath: string, destPath: string): boolean;
    fileExists(filePath: string): boolean;
    createShare(name: string, path: string, description?: string): Share;
    getShares(): Share[];
    deleteShare(name: string): boolean;
    private normalizePath;
    close(): void;
}
//# sourceMappingURL=FilesystemManager.d.ts.map