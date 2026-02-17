import path from 'path';
import { ExecutionResult } from '../CommandExecutor';
import { TerminalSession } from '../TerminalManager';
import { InMemoryFilesystemManager } from '../../filesystem/InMemoryFilesystemManager';

// Change directory
export async function cd(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\n${session.currentDirectory}\r\n`,
      exitCode: 0,
    };
  }

  let targetPath = args[0] ?? '';
  
  // Handle relative paths
  if (!targetPath.match(/^[A-Z]:\\/i)) {
    targetPath = path.join(session.currentDirectory, targetPath);
  }

  // Normalize path
  targetPath = path.normalize(targetPath).replace(/\//g, '\\');

  // Check if directory exists
  const dir = fs.getFile(targetPath);
  if (!dir) {
    return {
      output: session.shell === 'powershell'
        ? `\r\nSet-Location : Cannot find path '${targetPath}' because it does not exist.\r\n`
        : `\r\nThe system cannot find the path specified.\r\n`,
      error: 'Directory not found',
      exitCode: 1,
    };
  }

  if (dir.type !== 'directory') {
    return {
      output: `\r\nThe directory name is invalid.\r\n`,
      error: 'Not a directory',
      exitCode: 1,
    };
  }

  return {
    output: '',
    exitCode: 0,
    newDirectory: targetPath,
  };
}

// List directory contents
export async function dir(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult> {
  const targetPath = args.length > 0 && !args[0]?.startsWith('-') 
    ? path.join(session.currentDirectory, args[0] ?? '').replace(/\//g, '\\')
    : session.currentDirectory;

  const files = fs.listDirectory(targetPath);

  if (session.shell === 'powershell') {
    let output = `\r\n\r\n    Directory: ${targetPath}\r\n\r\n`;
    output += 'Mode                 LastWriteTime         Length Name\r\n';
    output += '----                 -------------         ------ ----\r\n';

    files.forEach(file => {
      const mode = file.type === 'directory' ? 'd----' : '-a---';
      const date = new Date(file.modifiedAt).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const size = file.type === "file" ? file.size.toString().padStart(10) : ''.padStart(10);
      output += `${mode.padEnd(20)} ${date.padEnd(25)} ${size} ${file.name}\r\n`;
    });

    output += '\r\n';
    return { output, exitCode: 0 };
  } else {
    // CMD style
    let output = `\r\n Directory of ${targetPath}\r\n\r\n`;
    
    const now = new Date();
    files.forEach(file => {
      const date = new Date(file.modifiedAt).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      const time = new Date(file.modifiedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      if (file.type === 'directory') {
        output += `${date}  ${time}    <DIR>          ${file.name}\r\n`;
      } else {
        const size = file.size.toString().padStart(16);
        output += `${date}  ${time} ${size} ${file.name}\r\n`;
      }
    });

    const fileCount = files.filter(f => f.type === 'file').length;
    const dirCount = files.filter(f => f.type === 'directory').length;
    const totalSize = files.filter(f => f.type === 'file').reduce((sum, f) => sum + f.size, 0);

    output += `\r\n               ${fileCount} File(s) ${totalSize.toLocaleString()} bytes\r\n`;
    output += `               ${dirCount} Dir(s)\r\n`;

    return { output, exitCode: 0 };
  }
}

// Create directory
export async function mkdir(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nThe syntax of the command is incorrect.\r\n`,
      exitCode: 1,
    };
  }

  let targetPath = args[0] ?? '';
  if (!targetPath.match(/^[A-Z]:\\/i)) {
    targetPath = path.join(session.currentDirectory, targetPath).replace(/\//g, '\\');
  }

  try {
    if (fs.fileExists(targetPath)) {
      return {
        output: `\r\nA subdirectory or file already exists.\r\n`,
        exitCode: 1,
      };
    }

    fs.createDirectory(targetPath);
    return {
      output: session.shell === 'powershell' ? '' : '\r\n',
      exitCode: 0,
    };
  } catch (error) {
    return {
      output: `\r\nError: ${(error instanceof Error ? error.message : String(error))}\r\n`,
      exitCode: 1,
    };
  }
}

// Copy file
export async function copy(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult> {
  if (args.length < 2) {
    return {
      output: `\r\nThe syntax of the command is incorrect.\r\n`,
      exitCode: 1,
    };
  }

  let source = args[0] ?? '';
  let dest = args[1] ?? '';

  if (!source.match(/^[A-Z]:\\/i)) {
    source = path.join(session.currentDirectory, source).replace(/\//g, '\\');
  }
  if (!dest.match(/^[A-Z]:\\/i)) {
    dest = path.join(session.currentDirectory, dest).replace(/\//g, '\\');
  }

  try {
    if (!fs.fileExists(source)) {
      return {
        output: `\r\nThe system cannot find the file specified.\r\n`,
        exitCode: 1,
      };
    }

    fs.copyFile(source, dest);
    return {
      output: `\r\n        1 file(s) copied.\r\n`,
      exitCode: 0,
    };
  } catch (error) {
    return {
      output: `\r\nError: ${(error instanceof Error ? error.message : String(error))}\r\n`,
      exitCode: 1,
    };
  }
}

// Move file
export async function move(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult> {
  if (args.length < 2) {
    return {
      output: `\r\nThe syntax of the command is incorrect.\r\n`,
      exitCode: 1,
    };
  }

  let source = args[0] ?? '';
  let dest = args[1] ?? '';

  if (!source.match(/^[A-Z]:\\/i)) {
    source = path.join(session.currentDirectory, source).replace(/\//g, '\\');
  }
  if (!dest.match(/^[A-Z]:\\/i)) {
    dest = path.join(session.currentDirectory, dest).replace(/\//g, '\\');
  }

  try {
    if (!fs.fileExists(source)) {
      return {
        output: `\r\nThe system cannot find the file specified.\r\n`,
        exitCode: 1,
      };
    }

    fs.moveFile(source, dest);
    return {
      output: `\r\n        1 file(s) moved.\r\n`,
      exitCode: 0,
    };
  } catch (error) {
    return {
      output: `\r\nError: ${(error instanceof Error ? error.message : String(error))}\r\n`,
      exitCode: 1,
    };
  }
}

// Delete file
export async function del(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nThe syntax of the command is incorrect.\r\n`,
      exitCode: 1,
    };
  }

  let targetPath = args[0] ?? '';
  if (!targetPath.match(/^[A-Z]:\\/i)) {
    targetPath = path.join(session.currentDirectory, targetPath).replace(/\//g, '\\');
  }

  try {
    if (!fs.fileExists(targetPath)) {
      return {
        output: `\r\nCould Not Find ${targetPath}\r\n`,
        exitCode: 1,
      };
    }

    const file = fs.getFile(targetPath);
    if (file && file.type === 'directory') {
      const recursive = args.includes('-Recurse') || args.includes('/s');
      fs.deleteDirectory(targetPath, recursive);
    } else {
      fs.deleteFile(targetPath);
    }

    return {
      output: '',
      exitCode: 0,
    };
  } catch (error) {
    return {
      output: `\r\nError: ${(error instanceof Error ? error.message : String(error))}\r\n`,
      exitCode: 1,
    };
  }
}

// Display file contents
export async function type(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nThe syntax of the command is incorrect.\r\n`,
      exitCode: 1,
    };
  }

  let targetPath = args[0] ?? '';
  if (!targetPath.match(/^[A-Z]:\\/i)) {
    targetPath = path.join(session.currentDirectory, targetPath).replace(/\//g, '\\');
  }

  const file = fs.getFile(targetPath);
  if (!file) {
    return {
      output: `\r\nThe system cannot find the file specified.\r\n`,
      exitCode: 1,
    };
  }

  if (file.type !== 'file') {
    return {
      output: `\r\nAccess is denied.\r\n`,
      exitCode: 1,
    };
  }

  return {
    output: `\r\n${file.content || ''}\r\n`,
    exitCode: 0,
  };
}
