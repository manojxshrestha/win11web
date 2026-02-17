import { ExecutionResult } from '../CommandExecutor';
import { TerminalSession } from '../TerminalManager';

// echo command
export async function echo(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  const message = args.join(' ');
  return {
    output: `\r\n${message}\r\n`,
    exitCode: 0,
  };
}

// clear screen command
export async function clear(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  return {
    output: '\x1b[2J\x1b[H', // ANSI escape codes for clear screen
    exitCode: 0,
  };
}

// help command
export async function help(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  let output = '\r\n';
  output += '=== Windows 11 Virtual Lab - Available Commands ===\r\n\r\n';
  
  output += 'FILE OPERATIONS:\r\n';
  output += '  dir, ls             List directory contents\r\n';
  output += '  cd <path>           Change directory\r\n';
  output += '  mkdir <name>        Create directory\r\n';
  output += '  copy <src> <dest>   Copy file\r\n';
  output += '  move <src> <dest>   Move file\r\n';
  output += '  del <file>          Delete file\r\n';
  output += '  type <file>         Display file contents\r\n\r\n';
  
  output += 'NETWORK COMMANDS:\r\n';
  output += '  ping <host>         Test network connectivity\r\n';
  output += '  ipconfig [/all]     Display IP configuration\r\n';
  output += '  tracert <host>      Trace route to host\r\n';
  output += '  net share           Manage network shares\r\n';
  output += '  net use             Map network drives\r\n';
  output += '  net view            View network computers\r\n\r\n';
  
  output += 'PROCESS MANAGEMENT:\r\n';
  output += '  Get-Process         List running processes\r\n';
  output += '  Stop-Process <pid>  Terminate a process\r\n\r\n';
  
  output += 'SYSTEM INFO:\r\n';
  output += '  systeminfo          Display system information\r\n';
  output += '  hostname            Display computer name\r\n\r\n';
  
  output += 'UTILITIES:\r\n';
  output += '  echo <text>         Display text\r\n';
  output += '  cls, clear          Clear screen\r\n';
  output += '  help                Show this help\r\n';
  output += '  exit                Close terminal session\r\n\r\n';

  return { output, exitCode: 0 };
}
