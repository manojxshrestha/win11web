import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

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

export class FilesystemManager {
  private db: Database.Database;

  constructor(dbPath: string = './data/filesystem.db') {
    // Ensure data directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.initializeDatabase();
    this.seedDefaultStructure();
  }

  private initializeDatabase(): void {
    // Files and directories table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL CHECK(type IN ('file', 'directory')),
        content TEXT,
        size INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        modified_at TEXT DEFAULT CURRENT_TIMESTAMP,
        parent_id INTEGER,
        FOREIGN KEY (parent_id) REFERENCES files(id) ON DELETE CASCADE
      )
    `);

    // Network shares table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS shares (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        path TEXT NOT NULL,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_files_path ON files(path);
      CREATE INDEX IF NOT EXISTS idx_files_parent ON files(parent_id);
      CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);
    `);
  }

  private seedDefaultStructure(): void {
    const checkRoot = this.db.prepare('SELECT COUNT(*) as count FROM files WHERE path = ?').get('C:\\');
    
    if ((checkRoot as any).count === 0) {
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

      const insert = this.db.prepare(`
        INSERT INTO files (name, path, type, size) VALUES (?, ?, 'directory', 0)
      `);

      const insertMany = this.db.transaction((dirs) => {
        for (const dir of dirs) {
          const name = dir === 'C:\\' ? 'C:' : path.basename(dir);
          insert.run(name, dir);
        }
      });

      insertMany(directories);

      // Create some sample files
      this.createFile('C:\\Users\\User\\Desktop\\Welcome.txt', 
        'Welcome to Windows 11 Virtual Lab!\r\n\r\nThis is a simulated Windows environment for IT training and testing.\r\n\r\nTry some commands:\r\n- dir (list files)\r\n- cd (change directory)\r\n- ipconfig (network info)\r\n- ping google.com\r\n- net share (view shares)\r\n');

      this.createFile('C:\\Users\\User\\Documents\\README.md',
        '# IT Lab Environment\r\n\r\nUse this environment to practice Windows administration tasks.\r\n');
    }
  }

  // File operations
  createFile(filePath: string, content: string = ''): FileNode {
    const normalizedPath = this.normalizePath(filePath);
    const name = path.basename(normalizedPath);
    const size = Buffer.byteLength(content, 'utf8');

    const insert = this.db.prepare(`
      INSERT INTO files (name, path, type, content, size, modified_at)
      VALUES (?, ?, 'file', ?, ?, CURRENT_TIMESTAMP)
    `);

    const result = insert.run(name, normalizedPath, content, size);

    return this.getFile(normalizedPath)!;
  }

  createDirectory(dirPath: string): FileNode {
    const normalizedPath = this.normalizePath(dirPath);
    const name = path.basename(normalizedPath);

    const insert = this.db.prepare(`
      INSERT INTO files (name, path, type, size)
      VALUES (?, ?, 'directory', 0)
    `);

    const result = insert.run(name, normalizedPath);

    return this.getFile(normalizedPath)!;
  }

  getFile(filePath: string): FileNode | null {
    const normalizedPath = this.normalizePath(filePath);
    
    const file = this.db.prepare(`
      SELECT id, name, path, type, content, size, 
             created_at as createdAt, modified_at as modifiedAt, parent_id as parentId
      FROM files WHERE path = ?
    `).get(normalizedPath) as FileNode | undefined;

    return file || null;
  }

  listDirectory(dirPath: string): FileNode[] {
    const normalizedPath = this.normalizePath(dirPath);
    
    // Get all files where parent path matches
    const files = this.db.prepare(`
      SELECT id, name, path, type, content, size,
             created_at as createdAt, modified_at as modifiedAt, parent_id as parentId
      FROM files 
      WHERE path LIKE ? AND path != ?
      ORDER BY type DESC, name ASC
    `).all(`${normalizedPath}%`, normalizedPath) as FileNode[];

    // Filter to only direct children
    return files.filter(file => {
      const relativePath = file.path.substring(normalizedPath.length);
      const parts = relativePath.split('\\').filter(p => p);
      return parts.length === 1;
    });
  }

  deleteFile(filePath: string): boolean {
    const normalizedPath = this.normalizePath(filePath);
    
    const result = this.db.prepare('DELETE FROM files WHERE path = ?').run(normalizedPath);
    return result.changes > 0;
  }

  deleteDirectory(dirPath: string, recursive: boolean = false): boolean {
    const normalizedPath = this.normalizePath(dirPath);
    
    if (recursive) {
      // Delete directory and all contents
      const result = this.db.prepare('DELETE FROM files WHERE path LIKE ?').run(`${normalizedPath}%`);
      return result.changes > 0;
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
    const newName = path.basename(normalizedDest);

    const result = this.db.prepare(`
      UPDATE files SET path = ?, name = ?, modified_at = CURRENT_TIMESTAMP 
      WHERE path = ?
    `).run(normalizedDest, newName, normalizedSource);

    return result.changes > 0;
  }

  copyFile(sourcePath: string, destPath: string): boolean {
    const source = this.getFile(sourcePath);
    if (!source) return false;

    const normalizedDest = this.normalizePath(destPath);
    const newName = path.basename(normalizedDest);

    const insert = this.db.prepare(`
      INSERT INTO files (name, path, type, content, size)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(newName, normalizedDest, source.type, source.content, source.size);
    return result.changes > 0;
  }

  fileExists(filePath: string): boolean {
    return this.getFile(filePath) !== null;
  }

  // Network shares
  createShare(name: string, path: string, description: string = ''): Share {
    const insert = this.db.prepare(`
      INSERT INTO shares (name, path, description) VALUES (?, ?, ?)
    `);

    insert.run(name, path, description);

    return { name, path, description };
  }

  getShares(): Share[] {
    return this.db.prepare('SELECT name, path, description FROM shares').all() as Share[];
  }

  deleteShare(name: string): boolean {
    const result = this.db.prepare('DELETE FROM shares WHERE name = ?').run(name);
    return result.changes > 0;
  }

  // Utilities
  private normalizePath(filePath: string): string {
    // Convert to Windows-style path and ensure it starts with C:\
    let normalized = filePath.replace(/\//g, '\\');
    
    if (!normalized.match(/^[A-Z]:\\/i)) {
      // Relative path - we'll assume it's relative to C:\
      normalized = 'C:\\' + normalized;
    }

    // Remove trailing backslash unless it's root
    if (normalized.length > 3 && normalized.endsWith('\\')) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  }

  close(): void {
    this.db.close();
  }
}
