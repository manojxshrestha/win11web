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

export class InMemoryFilesystemManager {
  private files: Map<string, FileNode> = new Map();
  private recycleBin: Map<string, RecycleBinEntry> = new Map();
  private shares: Map<string, Share> = new Map();
  private nextId = 1;

  constructor() {
    this.initializeDefaultStructure();
  }

  private initializeDefaultStructure(): void {
    // Create default Windows directory structure
    const directories = [
      'C:\\',
      'C:\\Users',
      'C:\\Users\\User',
      'C:\\Users\\User\\Desktop',
      'C:\\Users\\User\\Documents',
      'C:\\Users\\User\\Downloads',
      'C:\\Users\\User\\Pictures',
      'C:\\Users\\User\\Videos',
      'C:\\Users\\User\\Music',
      'C:\\Windows',
      'C:\\Windows\\System32',
      'C:\\Program Files',
      'C:\\Program Files (x86)',
    ];

    directories.forEach(dir => {
      const name = dir === 'C:\\' ? 'C:' : dir.split('\\').pop()!;
      this.files.set(dir, {
        id: this.nextId++,
        name,
        path: dir,
        type: 'directory',
        size: 0,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      });
    });

    // Create sample files
    this.createFile(
      'C:\\Users\\User\\Desktop\\Welcome.txt',
      'Welcome to Windows 11 Virtual Lab!\r\n\r\nThis is a simulated Windows environment for IT training and testing.\r\n\r\nTry some commands:\r\n- dir (list files)\r\n- cd (change directory)\r\n- ipconfig (network info)\r\n- ping google.com\r\n- net share (view shares)\r\n'
    );

    this.createFile(
      'C:\\Users\\User\\Documents\\README.md',
      '# IT Lab Environment\r\n\r\nUse this environment to practice Windows administration tasks.\r\n'
    );
  }

  createFile(filePath: string, content: string = ''): FileNode {
    const normalizedPath = this.normalizePath(filePath);
    const name = normalizedPath.split('\\').pop()!;
    const size = Buffer.byteLength(content, 'utf8');

    const file: FileNode = {
      id: this.nextId++,
      name,
      path: normalizedPath,
      type: 'file',
      content,
      size,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    this.files.set(normalizedPath, file);
    return file;
  }

  writeFile(filePath: string, content: string): FileNode | null {
    const normalizedPath = this.normalizePath(filePath);
    const existingFile = this.files.get(normalizedPath);
    
    if (!existingFile) {
      // Create new file if it doesn't exist
      return this.createFile(filePath, content);
    }

    if (existingFile.type === 'directory') {
      throw new Error('Cannot write to a directory');
    }

    const size = Buffer.byteLength(content, 'utf8');
    
    existingFile.content = content;
    existingFile.size = size;
    existingFile.modifiedAt = new Date().toISOString();
    
    this.files.set(normalizedPath, existingFile);
    return existingFile;
  }

  createDirectory(dirPath: string): FileNode {
    const normalizedPath = this.normalizePath(dirPath);
    const name = normalizedPath.split('\\').pop()!;

    const dir: FileNode = {
      id: this.nextId++,
      name,
      path: normalizedPath,
      type: 'directory',
      size: 0,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    this.files.set(normalizedPath, dir);
    return dir;
  }

  getFile(filePath: string): FileNode | null {
    const normalizedPath = this.normalizePath(filePath);
    return this.files.get(normalizedPath) || null;
  }

  listDirectory(dirPath: string): FileNode[] {
    const normalizedPath = this.normalizePath(dirPath);
    const results: FileNode[] = [];

    this.files.forEach((file) => {
      if (file.path === normalizedPath) return;
      
      // Check if this file is a direct child
      if (file.path.startsWith(normalizedPath)) {
        const relativePath = file.path.substring(normalizedPath.length);
        const parts = relativePath.split('\\').filter(p => p);
        
        // Only include direct children (1 level deep)
        if (parts.length === 1) {
          results.push(file);
        }
      }
    });

    return results.sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  deleteFile(filePath: string): boolean {
    const normalizedPath = this.normalizePath(filePath);
    return this.files.delete(normalizedPath);
  }

  deleteDirectory(dirPath: string, recursive: boolean = false): boolean {
    const normalizedPath = this.normalizePath(dirPath);

    if (recursive) {
      // Delete directory and all contents
      const toDelete: string[] = [];
      this.files.forEach((file, path) => {
        if (path.startsWith(normalizedPath)) {
          toDelete.push(path);
        }
      });
      toDelete.forEach(path => this.files.delete(path));
      return toDelete.length > 0;
    } else {
      // Check if directory is empty
      const children = this.listDirectory(normalizedPath);
      if (children.length > 0) {
        throw new Error('Directory is not empty. Use -Recurse flag to delete non-empty directories.');
      }
      return this.deleteFile(normalizedPath);
    }
  }

  moveFile(sourcePath: string, destPath: string): boolean {
    const normalizedSource = this.normalizePath(sourcePath);
    const normalizedDest = this.normalizePath(destPath);
    
    const file = this.files.get(normalizedSource);
    if (!file) return false;

    this.files.delete(normalizedSource);
    
    const newName = normalizedDest.split('\\').pop()!;
    file.path = normalizedDest;
    file.name = newName;
    file.modifiedAt = new Date().toISOString();
    
    this.files.set(normalizedDest, file);
    return true;
  }

  copyFile(sourcePath: string, destPath: string): boolean {
    const source = this.getFile(sourcePath);
    if (!source) return false;

    const normalizedDest = this.normalizePath(destPath);
    const newName = normalizedDest.split('\\').pop()!;

    const copy: FileNode = {
      id: this.nextId++,
      name: newName,
      path: normalizedDest,
      type: source.type,
      content: source.content,
      size: source.size,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    this.files.set(normalizedDest, copy);
    return true;
  }

  fileExists(filePath: string): boolean {
    return this.getFile(filePath) !== null;
  }

  // Recycle Bin operations
  recycleFile(filePath: string): RecycleBinEntry | null {
    const normalizedPath = this.normalizePath(filePath);
    const file = this.files.get(normalizedPath);
    
    if (!file) {
      return null;
    }

    // Remove from files
    this.files.delete(normalizedPath);

    // Add to recycle bin
    const entry: RecycleBinEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      originalPath: file.path,
      path: `C:\\RECYCLE\\${file.name}_${Date.now()}`,
      type: file.type,
      content: file.content,
      size: file.size,
      deletedAt: new Date().toISOString(),
    };

    this.recycleBin.set(entry.id, entry);
    return entry;
  }

  recycleDirectory(dirPath: string, recursive: boolean = false): RecycleBinEntry[] {
    const normalizedPath = this.normalizePath(dirPath);
    const dir = this.files.get(normalizedPath);
    
    if (!dir || dir.type !== 'directory') {
      return [];
    }

    const entries: RecycleBinEntry[] = [];

    if (recursive) {
      // Recycle directory and all contents
      this.files.forEach((file, path) => {
        if (path.startsWith(normalizedPath)) {
          const entry = this.recycleFile(path);
          if (entry) {
            entries.push(entry);
          }
        }
      });
    } else {
      // Recycle only the directory (must be empty)
      const children = this.listDirectory(normalizedPath);
      if (children.length > 0) {
        throw new Error('Directory is not empty. Use -Recurse flag to recycle non-empty directories.');
      }
      const entry = this.recycleFile(normalizedPath);
      if (entry) {
        entries.push(entry);
      }
    }

    return entries;
  }

  getRecycleBinItems(): RecycleBinEntry[] {
    return Array.from(this.recycleBin.values()).sort(
      (a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
    );
  }

  getRecycleBinItem(id: string): RecycleBinEntry | null {
    return this.recycleBin.get(id) || null;
  }

  restoreFromRecycleBin(id: string): boolean {
    const entry = this.recycleBin.get(id);
    
    if (!entry) {
      return false;
    }

    // Check if file already exists at original location
    if (this.fileExists(entry.originalPath)) {
      throw new Error('File already exists at the restore location');
    }

    // Create the file/directory at original location
    if (entry.type === 'directory') {
      this.createDirectory(entry.originalPath);
    } else {
      this.createFile(entry.originalPath, entry.content || '');
    }

    // Remove from recycle bin
    this.recycleBin.delete(id);
    return true;
  }

  deleteFromRecycleBin(id: string): boolean {
    return this.recycleBin.delete(id);
  }

  emptyRecycleBin(): number {
    const count = this.recycleBin.size;
    this.recycleBin.clear();
    return count;
  }

  // Network shares
  createShare(name: string, path: string, description: string = ''): Share {
    const share = { name, path, description };
    this.shares.set(name, share);
    return share;
  }

  getShares(): Share[] {
    return Array.from(this.shares.values());
  }

  deleteShare(name: string): boolean {
    return this.shares.delete(name);
  }

  // Utilities
  private normalizePath(filePath: string): string {
    // Convert to Windows-style path and ensure it starts with C:\
    let normalized = filePath.replace(/\//g, '\\');
    
    if (!normalized.match(/^[A-Z]:\\/i)) {
      // Relative path - assume C:\
      normalized = 'C:\\' + normalized;
    }

    // Remove trailing backslash unless it's root
    if (normalized.length > 3 && normalized.endsWith('\\')) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  }

  // Complete path for tab completion
  completePath(prefix: string, currentDir: string): string[] {
    // Normalize the prefix
    let searchPath = prefix;
    let basePath = currentDir;
    
    // Handle relative paths and .. navigation
    if (prefix.includes('\\')) {
      const lastBackslash = prefix.lastIndexOf('\\');
      const pathPart = prefix.substring(0, lastBackslash);
      const searchPart = prefix.substring(lastBackslash + 1);
      
      // Resolve the base path
      if (pathPart === '..') {
        // Go up one level from current directory
        const parts = currentDir.split('\\');
        if (parts.length > 1) {
          parts.pop();
          basePath = parts.join('\\');
        }
      } else if (pathPart.startsWith('..\\')) {
        // Go up multiple levels
        let tempPath = currentDir;
        let remaining = pathPart;
        while (remaining.startsWith('..\\')) {
          const parts = tempPath.split('\\');
          if (parts.length > 1) {
            parts.pop();
            tempPath = parts.join('\\');
          }
          remaining = remaining.substring(3);
        }
        if (remaining) {
          tempPath += '\\' + remaining;
        }
        basePath = tempPath;
      } else if (pathPart.match(/^[A-Z]:/i)) {
        // Absolute path
        basePath = pathPart;
      } else {
        // Relative path from current directory
        basePath = currentDir + '\\' + pathPart;
      }
      
      searchPath = searchPart;
    } else if (prefix.startsWith('.')) {
      if (prefix === '..') {
        const parts = currentDir.split('\\');
        if (parts.length > 1) {
          parts.pop();
          basePath = parts.join('\\');
        }
        searchPath = '';
      } else if (prefix.startsWith('.\\')) {
        searchPath = prefix.substring(2);
      }
    }
    
    // Normalize base path
    basePath = this.normalizePath(basePath);
    
    const completions: string[] = [];
    
    // Get all items in the base path
    this.files.forEach((file) => {
      if (file.path === basePath) return;
      
      if (file.path.startsWith(basePath + '\\')) {
        const relativePath = file.path.substring(basePath.length + 1);
        const parts = relativePath.split('\\');
        
        // Only include direct children (1 level deep)
        if (parts.length === 1) {
          const name = parts[0] ?? '';
          if (searchPath === '' || name.toLowerCase().startsWith(searchPath.toLowerCase())) {
            completions.push(name + (file.type === 'directory' ? '\\' : ''));
          }
        }
      }
    });
    
    // Sort: directories first, then alphabetically
    completions.sort((a, b) => {
      const aIsDir = a.endsWith('\\');
      const bIsDir = b.endsWith('\\');
      
      if (aIsDir !== bIsDir) {
        return aIsDir ? -1 : 1;
      }
      return a.localeCompare(b);
    });
    
    return completions;
  }
}
