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
export interface RecycleBinEntry {
    id: string;
    name: string;
    originalPath: string;
    path: string;
    type: 'file' | 'directory';
    content?: string;
    size: number;
    deletedAt: string;
}
export interface Share {
    name: string;
    path: string;
    description: string;
}
export declare class InMemoryFilesystemManager {
    private files;
    private recycleBin;
    private shares;
    private nextId;
    constructor();
    private initializeDefaultStructure;
    createFile(filePath: string, content?: string): FileNode;
    writeFile(filePath: string, content: string): FileNode | null;
    createDirectory(dirPath: string): FileNode;
    getFile(filePath: string): FileNode | null;
    listDirectory(dirPath: string): FileNode[];
    deleteFile(filePath: string): boolean;
    deleteDirectory(dirPath: string, recursive?: boolean): boolean;
    moveFile(sourcePath: string, destPath: string): boolean;
    copyFile(sourcePath: string, destPath: string): boolean;
    fileExists(filePath: string): boolean;
    recycleFile(filePath: string): RecycleBinEntry | null;
    recycleDirectory(dirPath: string, recursive?: boolean): RecycleBinEntry[];
    getRecycleBinItems(): RecycleBinEntry[];
    getRecycleBinItem(id: string): RecycleBinEntry | null;
    restoreFromRecycleBin(id: string): boolean;
    deleteFromRecycleBin(id: string): boolean;
    emptyRecycleBin(): number;
    createShare(name: string, path: string, description?: string): Share;
    getShares(): Share[];
    deleteShare(name: string): boolean;
    private normalizePath;
    completePath(prefix: string, currentDir: string): string[];
}
//# sourceMappingURL=InMemoryFilesystemManager.d.ts.map