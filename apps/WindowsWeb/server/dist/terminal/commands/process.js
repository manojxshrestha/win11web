"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopProcess = exports.getProcess = void 0;
const mockProcesses = [
    { name: 'System', pid: 4, cpu: 0, memory: 256 },
    { name: 'explorer', pid: 1234, cpu: 2, memory: 45000 },
    { name: 'chrome', pid: 2345, cpu: 15, memory: 250000 },
    { name: 'code', pid: 3456, cpu: 5, memory: 120000 },
    { name: 'powershell', pid: 4567, cpu: 1, memory: 35000 },
    { name: 'svchost', pid: 876, cpu: 0, memory: 12000 },
    { name: 'svchost', pid: 1024, cpu: 0, memory: 8000 },
    { name: 'svchost', pid: 1456, cpu: 1, memory: 15000 },
    { name: 'dwm', pid: 1100, cpu: 1, memory: 25000 },
    { name: 'SearchApp', pid: 5678, cpu: 0, memory: 32000 },
];
// Get-Process command
async function getProcess(args, session) {
    const filterName = args.length > 0 ? args[0]?.toLowerCase() : null;
    let processes = mockProcesses;
    if (filterName) {
        processes = processes.filter(p => p.name.toLowerCase().includes(filterName));
    }
    if (session.shell === 'powershell') {
        let output = '\r\n\r\n';
        output += 'Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName\r\n';
        output += '-------  ------    -----      -----     ------     --  -- -----------\r\n';
        processes.forEach(proc => {
            const handles = Math.floor(Math.random() * 500) + 100;
            const npm = Math.floor(Math.random() * 50) + 10;
            const pm = proc.memory;
            const ws = Math.floor(pm * 1.2);
            const cpu = proc.cpu.toFixed(2);
            output += `${handles.toString().padStart(7)}  `;
            output += `${npm.toString().padStart(6)}    `;
            output += `${pm.toLocaleString().padStart(5)}      `;
            output += `${ws.toLocaleString().padStart(5)}     `;
            output += `${cpu.padStart(6)}     `;
            output += `${proc.pid.toString().padStart(2)}  `;
            output += `${Math.floor(Math.random() * 3).toString().padStart(2)} `;
            output += `${proc.name}\r\n`;
        });
        return { output, exitCode: 0 };
    }
    else {
        // Tasklist style for CMD
        let output = '\r\n';
        output += 'Image Name                     PID Session Name        Session#    Mem Usage\r\n';
        output += '========================= ======== ================ =========== ============\r\n';
        processes.forEach(proc => {
            const memUsage = `${Math.floor(proc.memory / 1024).toLocaleString()} K`;
            output += `${(proc.name + '.exe').padEnd(25)} `;
            output += `${proc.pid.toString().padStart(8)} `;
            output += `Console                      1 `;
            output += `${memUsage.padStart(12)}\r\n`;
        });
        return { output, exitCode: 0 };
    }
}
exports.getProcess = getProcess;
// Stop-Process command
async function stopProcess(args, session) {
    if (args.length === 0) {
        return {
            output: session.shell === 'powershell'
                ? `\r\nStop-Process : Missing required parameter. Provide a process name or ID.\r\n`
                : `\r\nERROR: Missing parameter. Provide a process ID or name.\r\n`,
            exitCode: 1,
        };
    }
    const target = args[0] ?? '';
    const isNumeric = /^\d+$/.test(target);
    // Find the process
    const process = isNumeric
        ? mockProcesses.find(p => p.pid === parseInt(target))
        : mockProcesses.find(p => p.name.toLowerCase() === target.toLowerCase());
    if (!process) {
        return {
            output: `\r\nERROR: Process "${target}" not found.\r\n`,
            exitCode: 1,
        };
    }
    // Simulate process termination
    if (session.shell === 'powershell') {
        return {
            output: `\r\n`, // PowerShell stops silently on success
            exitCode: 0,
        };
    }
    else {
        return {
            output: `\r\nSUCCESS: Sent termination signal to the process with PID ${process.pid}.\r\n`,
            exitCode: 0,
        };
    }
}
exports.stopProcess = stopProcess;
//# sourceMappingURL=process.js.map