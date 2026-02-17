"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandExecutor = void 0;
const commands = __importStar(require("./commands"));
class CommandExecutor {
    constructor(filesystemManager, shell) {
        this.filesystemManager = filesystemManager;
        this.shell = shell;
    }
    async execute(input, session) {
        const trimmed = input.trim();
        if (!trimmed) {
            return {
                output: '',
                exitCode: 0,
            };
        }
        // Parse command and arguments
        const parts = this.parseCommand(trimmed);
        const command = parts[0]?.toLowerCase() ?? '';
        const args = parts.slice(1);
        try {
            // Route to appropriate command handler
            switch (command) {
                // Directory navigation
                case 'cd':
                case 'chdir':
                case 'set-location':
                    return await commands.cd(args, session, this.filesystemManager);
                // Directory listing
                case 'dir':
                case 'ls':
                case 'get-childitem':
                    return await commands.dir(args, session, this.filesystemManager);
                // File operations
                case 'copy':
                case 'cp':
                case 'copy-item':
                    return await commands.copy(args, session, this.filesystemManager);
                case 'move':
                case 'mv':
                case 'move-item':
                    return await commands.move(args, session, this.filesystemManager);
                case 'del':
                case 'rm':
                case 'remove-item':
                    return await commands.del(args, session, this.filesystemManager);
                case 'mkdir':
                case 'md':
                case 'new-item':
                    return await commands.mkdir(args, session, this.filesystemManager);
                case 'type':
                case 'cat':
                case 'get-content':
                    return await commands.type(args, session, this.filesystemManager);
                // ==================== NETWORK COMMANDS ====================
                // IP Configuration Commands
                case 'ipconfig':
                    return await commands.ipconfig(args, session);
                case 'get-netipaddress':
                    return await commands.getNetIPAddress(args, session);
                case 'get-netadapter':
                    return await commands.getNetAdapter(args, session);
                // Connectivity Testing Commands
                case 'ping':
                case 'test-connection':
                    return await commands.ping(args, session);
                case 'test-netconnection':
                    return await commands.testNetConnection(args, session);
                case 'tracert':
                case 'traceroute':
                    return await commands.tracert(args, session);
                case 'pathping':
                    return await commands.pathping(args, session);
                // DNS Commands
                case 'nslookup':
                    return await commands.nslookup(args, session);
                case 'resolve-dnsname':
                    return await commands.resolveDnsName(args, session);
                // Active Connections Commands
                case 'netstat':
                    return await commands.netstat(args, session);
                case 'get-nettcpconnection':
                    return await commands.getNetTCPConnection(args, session);
                case 'get-netudpendpoint':
                    return await commands.getNetUDPEndpoint(args, session);
                // Routing & ARP Commands
                case 'route':
                    return await commands.routePrint(args, session);
                case 'get-netroute':
                    return await commands.getNetRoute(args, session);
                case 'arp':
                    return await commands.arp(args, session);
                // Network Sharing Commands
                case 'net':
                    return await commands.net(args, session, this.filesystemManager);
                // Firewall & Advanced Config Commands
                case 'netsh':
                    return await commands.netsh(args, session);
                // Other Network Commands
                case 'get-netconnectionprofile':
                    return await commands.getNetConnectionProfile(args, session);
                case 'nbtstat':
                    return await commands.nbtstat(args, session);
                case 'hostname':
                    return await commands.hostname(args, session);
                case 'getmac':
                    return await commands.getmac(args, session);
                // Process commands
                case 'get-process':
                case 'ps':
                    return await commands.getProcess(args, session);
                case 'stop-process':
                case 'kill':
                    return await commands.stopProcess(args, session);
                // System info
                case 'systeminfo':
                    return await commands.systeminfo(args, session);
                // Utilities
                case 'echo':
                case 'write-output':
                    return await commands.echo(args, session);
                case 'cls':
                case 'clear':
                    return await commands.clear(args, session);
                case 'help':
                    return await commands.help(args, session);
                case 'exit':
                    return {
                        output: 'Session will be closed.\r\n',
                        exitCode: 0,
                    };
                default:
                    return {
                        output: this.shell === 'powershell'
                            ? `\r\n${command} : The term '${command}' is not recognized as the name of a cmdlet, function, script file, or operable program.\r\n`
                            : `\r\n'${command}' is not recognized as an internal or external command,\r\noperable program or batch file.\r\n`,
                        error: `Command not found: ${command}`,
                        exitCode: 1,
                    };
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error);
            return {
                output: `Error: ${errorMessage}\r\n`,
                error: errorMessage,
                exitCode: 1,
            };
        }
    }
    parseCommand(input) {
        const parts = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
            }
            else if (char === quoteChar && inQuotes) {
                inQuotes = false;
                quoteChar = '';
            }
            else if (char === ' ' && !inQuotes) {
                if (current) {
                    parts.push(current);
                    current = '';
                }
            }
            else {
                current += char;
            }
        }
        if (current) {
            parts.push(current);
        }
        return parts;
    }
}
exports.CommandExecutor = CommandExecutor;
//# sourceMappingURL=CommandExecutor.js.map