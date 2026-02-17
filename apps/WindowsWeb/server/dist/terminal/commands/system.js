"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoami = exports.hostname = exports.systeminfo = void 0;
// systeminfo command
async function systeminfo(args, session) {
    let output = '\r\n';
    output += 'Host Name:                 ' + session.environmentVariables['COMPUTERNAME'] + '\r\n';
    output += 'OS Name:                   Microsoft Windows 11 Pro\r\n';
    output += 'OS Version:                10.0.22000 N/A Build 22000\r\n';
    output += 'OS Manufacturer:           Microsoft Corporation\r\n';
    output += 'OS Configuration:          Standalone Workstation\r\n';
    output += 'OS Build Type:             Multiprocessor Free\r\n';
    output += 'Registered Owner:          ' + session.environmentVariables['USERNAME'] + '\r\n';
    output += 'Registered Organization:   IT Company Kathmandu\r\n';
    output += 'Product ID:                00000-00000-00000-AAAAA\r\n';
    output += 'Original Install Date:     1/15/2024, 10:30:00 AM\r\n';
    output += 'System Boot Time:          ' + new Date().toLocaleString('en-US') + '\r\n';
    output += 'System Manufacturer:       Virtual Lab\r\n';
    output += 'System Model:              Windows 11 Web\r\n';
    output += 'System Type:               x64-based PC\r\n';
    output += 'Processor(s):              1 Processor(s) Installed.\r\n';
    output += '                           [01]: Intel64 Family 6 Model 142 Stepping 12 GenuineIntel ~2712 Mhz\r\n';
    output += 'BIOS Version:              Virtual BIOS v1.0\r\n';
    output += 'Windows Directory:         C:\\Windows\r\n';
    output += 'System Directory:          C:\\Windows\\system32\r\n';
    output += 'Boot Device:               \\Device\\HarddiskVolume1\r\n';
    output += 'Total Physical Memory:     16,384 MB\r\n';
    output += 'Available Physical Memory: 8,192 MB\r\n';
    output += 'Virtual Memory: Max Size:  32,768 MB\r\n';
    output += 'Virtual Memory: Available: 20,480 MB\r\n';
    output += 'Domain:                    ' + session.environmentVariables['USERDOMAIN'] + '\r\n';
    output += 'Logon Server:              \\\\' + session.environmentVariables['COMPUTERNAME'] + '\r\n';
    return { output, exitCode: 0 };
}
exports.systeminfo = systeminfo;
// hostname command - NOTE: also exported from network.ts
// This is kept for backward compatibility but may conflict
async function hostname(args, session) {
    const hostname = session.environmentVariables['COMPUTERNAME'] || 'pwn';
    return {
        output: `\r\n${hostname}\r\n`,
        exitCode: 0,
    };
}
exports.hostname = hostname;
// whoami command
async function whoami(args, session) {
    const username = session.environmentVariables['USERNAME'] || 'Manoj';
    const domain = session.environmentVariables['USERDOMAIN'] || 'pwn';
    let output = '';
    if (args.includes('/user')) {
        output = `${domain}\\${username}\r\n`;
    }
    else if (args.includes('/groups')) {
        output = `\r\nGROUP INFORMATION\r\n\r\nGroup Name                Type\r\n----------------------------------------\r\nEveryone                  Well-known group\r\nUsers                     Well-known group\r\n`;
    }
    else {
        output = `${domain}\\${username}\r\n`;
    }
    return { output, exitCode: 0 };
}
exports.whoami = whoami;
//# sourceMappingURL=system.js.map