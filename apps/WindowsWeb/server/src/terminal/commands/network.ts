import { ExecutionResult } from '../CommandExecutor';
import { TerminalSession } from '../TerminalManager';
import { InMemoryFilesystemManager } from '../../filesystem/InMemoryFilesystemManager';

// ============================================================================
// IP Configuration & Adapter Commands
// ============================================================================

export async function ipconfig(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  const showAll = args.includes('/all');
  const release = args.includes('/release');
  const renew = args.includes('/renew');
  const flushdns = args.includes('/flushdns');
  const displaydns = args.includes('/displaydns');

  // Handle /release
  if (release) {
    return {
      output: `\r\nWindows IP Configuration\r\n\r\nEthernet adapter Ethernet:\r\n   Connection-specific DNS Suffix  . : localdomain\r\n   IPv4 Address. . . . . . . . . . . : 192.168.1.100\r\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\r\n   Default Gateway . . . . . . . . . : 192.168.1.1\r\n\r\nThe operation completed successfully.\r\n`,
      exitCode: 0,
    };
  }

  // Handle /renew
  if (renew) {
    return {
      output: `\r\nWindows IP Configuration\r\n\r\nEthernet adapter Ethernet:\r\n   Connection-specific DNS Suffix  . : localdomain\r\n   IPv4 Address. . . . . . . . . . . : 192.168.1.100\r\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\r\n   Default Gateway . . . . . . . . . : 192.168.1.1\r\n\r\nThe DHCP lease was renewed. New lease obtained.\r\n\r\nThe operation completed successfully.\r\n`,
      exitCode: 0,
    };
  }

  // Handle /flushdns
  if (flushdns) {
    return {
      output: `\r\nWindows IP Configuration\r\n\r\nSuccessfully flushed the DNS Resolver Cache.\r\n`,
      exitCode: 0,
    };
  }

  // Handle /displaydns
  if (displaydns) {
    return {
      output: `\r\nWindows IP Configuration\r\n\r\n    DNS Cache\r\n\r\n   www.google.com\r\n   ----------------------------------------\r\n   Record Name . . . . . . : www.google.com\r\n   Record Type . . . . . . : 1\r\n   Time To Live  . . . . . : 298\r\n   Data Length . . . . . . : 4\r\n   Section . . . . . . . . : Answer\r\n   A (Host) Record . . . . : 142.250.185.228\r\n\r\n   www.microsoft.com\r\n   ----------------------------------------\r\n   Record Name . . . . . . : www.microsoft.com\r\n   Record Type . . . . . . : 1\r\n   Time To Live  . . . . . : 299\r\n   Data Length . . . . . . : 4\r\n   Section . . . . . . . . : Answer\r\n   A (Host) Record . . . . : 20.70.246.20\r\n\r\nThe command completed successfully.\r\n`,
      exitCode: 0,
    };
  }

  let output = '\r\n';

  if (showAll) {
    output += 'Windows IP Configuration\r\n\r\n';
    output += `   Host Name . . . . . . . . . . . . : ${session.environmentVariables['COMPUTERNAME']}\r\n`;
    output += '   Primary Dns Suffix  . . . . . . : \r\n';
    output += '   Node Type . . . . . . . . . . . . : Hybrid\r\n';
    output += '   IP Routing Enabled. . . . . . . . : No\r\n';
    output += '   WINS Proxy Enabled. . . . . . . . : No\r\n\r\n';
  }

  output += 'Ethernet adapter Ethernet:\r\n\r\n';
  output += '   Connection-specific DNS Suffix  . : localdomain\r\n';
  
  if (showAll) {
    output += '   Description . . . . . . . . . . . : Intel(R) Ethernet Connection (2) I219-V\r\n';
    output += '   Physical Address. . . . . . . . . : 00-15-5D-01-23-45\r\n';
    output += '   DHCP Enabled. . . . . . . . . . . : Yes\r\n';
    output += '   Autoconfiguration Enabled . . . . : Yes\r\n';
  }

  output += '   IPv4 Address. . . . . . . . . . . : 192.168.1.100(Preferred)\r\n';
  output += '   Subnet Mask . . . . . . . . . . . : 255.255.255.0\r\n';
  
  if (showAll) {
    output += '   Lease Obtained. . . . . . . . . . : ' + new Date(Date.now() - 3600000).toLocaleString('en-US') + '\r\n';
    const leaseExpiry = new Date(Date.now() + 86400000);
    output += '   Lease Expires . . . . . . . . . . : ' + leaseExpiry.toLocaleString('en-US') + '\r\n';
  }

  output += '   Default Gateway . . . . . . . . . : 192.168.1.1\r\n';
  
  if (showAll) {
    output += '   DHCP Server . . . . . . . . . . . : 192.168.1.1\r\n';
    output += '   DNS Servers . . . . . . . . . . . : 192.168.1.1\r\n';
    output += '                                       8.8.8.8\r\n';
    output += '                                       1.1.1.1\r\n';
    output += '   NetBIOS over Tcpip. . . . . . . . : Enabled\r\n';
  }

  // Wi-Fi adapter
  output += '\r\nWireless LAN adapter Wi-Fi:\r\n\r\n';
  output += '   Connection-specific DNS Suffix  . : localdomain\r\n';
  
  if (showAll) {
    output += '   Description . . . . . . . . . . . : Intel(R) Wireless-AC 9560 160MHz\r\n';
    output += '   Physical Address. . . . . . . . . : 00-15-5D-01-23-46\r\n';
    output += '   DHCP Enabled. . . . . . . . . . . : Yes\r\n';
    output += '   Autoconfiguration Enabled . . . . : Yes\r\n';
  }

  output += '   IPv4 Address. . . . . . . . . . . : 192.168.1.105(Preferred)\r\n';
  output += '   Subnet Mask . . . . . . . . . . . : 255.255.255.0\r\n';
  output += '   Default Gateway . . . . . . . . . : 192.168.1.1\r\n';
  
  if (showAll) {
    output += '   DNS Servers . . . . . . . . . . . : 192.168.1.1\r\n';
    output += '                                       8.8.8.8\r\n';
  }

  return { output, exitCode: 0 };
}

// Get-NetIPAddress - PowerShell command
export async function getNetIPAddress(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  let output = '\r\n';
  output += 'InterfaceAlias               : Ethernet\r\n';
  output += 'InterfaceIndex               : 3\r\n';
  output += 'InterfaceDescription         : Intel(R) Ethernet Connection (2) I219-V\r\n';
  output += 'NetworkCategory              : Public\r\n';
  output += 'Domain                       : localdomain\r\n';
  output += 'LinkLayerAddress             : 00-15-5D-01-23-45\r\n';
  output += 'IPv4Address                  : 192.168.1.100\r\n';
  output += 'IPv4DefaultGateway           : 192.168.1.1\r\n';
  output += 'DNSServer                    : 192.168.1.1, 8.8.8.8\r\n';
  output += 'MACAddress                   : 00-15-5D-01-23-45\r\n';
  output += 'Status                       : Up\r\n';
  output += '\r\n';
  output += 'InterfaceAlias               : Wi-Fi\r\n';
  output += 'InterfaceIndex               : 5\r\n';
  output += 'InterfaceDescription         : Intel(R) Wireless-AC 9560 160MHz\r\n';
  output += 'NetworkCategory              : Private\r\n';
  output += 'Domain                       : localdomain\r\n';
  output += 'LinkLayerAddress             : 00-15-5D-01-23-46\r\n';
  output += 'IPv4Address                  : 192.168.1.105\r\n';
  output += 'IPv4DefaultGateway           : 192.168.1.1\r\n';
  output += 'DNSServer                    : 192.168.1.1, 8.8.8.8\r\n';
  output += 'MACAddress                   : 00-15-5D-01-23-46\r\n';
  output += 'Status                       : Up\r\n';

  return { output, exitCode: 0 };
}

// Get-NetAdapter - PowerShell command
export async function getNetAdapter(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  let output = '\r\n';
  output += 'Name                      InterfaceDescription                    Status       MAC Address\r\n';
  output += '----                      ---------------------                    ------       ----------\r\n';
  output += 'Ethernet                  Intel(R) Ethernet Connection (2) I219-V Up           00-15-5D-01-23-45\r\n';
  output += 'Wi-Fi                     Intel(R) Wireless-AC 9560 160MHz        Up           00-15-5D-01-23-46\r\n';
  output += 'Bluetooth                 Bluetooth Device (Personal Area Net...  Disconnected 00-15-5D-01-23-47\r\n';

  return { output, exitCode: 0 };
}

// ============================================================================
// Connectivity Testing Commands
// ============================================================================

export async function ping(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  // Check for PowerShell Test-Connection alias
  if (session.shell === 'powershell' && args[0]?.toLowerCase() === '-computername') {
    args = args.slice(1);
  }

  if (args.length === 0) {
    return {
      output: `\r\nUsage: ping [-t] [-n count] target_name\r\n`,
      exitCode: 1,
    };
  }

  const target = args[args.length - 1] ?? '';
  let count = 4;
  let continuous = false;

  // Parse options
  for (let i = 0; i < args.length - 1; i++) {
    if (args[i] === '-t') continuous = true;
    if (args[i] === '-n' && args[i + 1]) {
      count = parseInt(args[i + 1] ?? '4');
      i++;
    }
  }

  let output = `\r\nPinging ${target} with 32 bytes of data:\r\n`;

  // Simulate ping responses
  for (let i = 0; i < count; i++) {
    const time = Math.floor(Math.random() * 50) + 10;
    const ttl = 64;
    const replyIP = `192.168.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;
    output += `Reply from ${replyIP}: bytes=32 time=${time}ms TTL=${ttl}\r\n`;
  }

  output += `\r\nPing statistics for ${target}:\r\n`;
  output += `    Packets: Sent = ${count}, Received = ${count}, Lost = 0 (0% loss),\r\n`;
  output += `Approximate round trip times in milli-seconds:\r\n`;
  output += `    Minimum = 10ms, Maximum = 50ms, Average = 30ms\r\n`;

  return { output, exitCode: 0 };
}

// Test-Connection - PowerShell command (advanced ping)
export async function testConnection(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nTest-Connection : Missing the required parameter ComputerName.\r\n`,
      exitCode: 1,
    };
  }

  const target = args[args.length - 1] ?? '';
  let count = 1;

  for (let i = 0; i < args.length - 1; i++) {
    if (args[i] === '-Count' && args[i + 1]) {
      count = parseInt(args[i + 1] ?? '1');
      i++;
    }
  }

  let output = `\r\n`;
  
  for (let i = 0; i < count; i++) {
    const time = Math.floor(Math.random() * 50) + 10;
    const ttl = 64;
    output += `Source        Destination     IPV4Address      Bytes    Time(ms)\r\n`;
    output += `${session.environmentVariables['COMPUTERNAME']}   ${target}         192.168.1.100     32       ${time}\r\n`;
  }

  output += '\r\nPing as Job:\r\n';

  return { output, exitCode: 0 };
}

// Test-NetConnection - PowerShell command
export async function testNetConnection(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nTest-NetConnection : Missing the required parameter ComputerName.\r\n`,
      exitCode: 1,
    };
  }

  const target = args[0] ?? '';
  const hasPort = args.includes('-Port');
  let port: number | undefined;

  if (hasPort) {
    const portIndex = args.indexOf('-Port');
    port = parseInt(args[portIndex + 1] ?? '0');
  }

  let output = '\r\n';

  if (port) {
    // TCP port test
    output += `ComputerName           : ${target}\r\n`;
    output += `RemotePort             : ${port}\r\n`;
    output += `InterfaceAlias         : Ethernet\r\n`;
    output += `SourceAddress          : 192.168.1.100\r\n`;
    output += `NetRoute (NextHop)     : 192.168.1.1\r\n`;
    output += `PingSucceeded          : True\r\n`;
    output += `PingReplyDetails (RTT) : 12ms\r\n`;
    output += `TcpTestSucceeded       : True\r\n`;
  } else {
    // Basic connectivity test
    output += `ComputerName           : ${target}\r\n`;
    output += `RemoteAddress          : 142.250.185.228\r\n`;
    output += `InterfaceAlias         : Ethernet\r\n`;
    output += `SourceAddress          : 192.168.1.100\r\n`;
    output += `NetRoute (NextHop)     : 192.168.1.1\r\n`;
    output += `PingSucceeded          : True\r\n`;
    output += `PingReplyDetails (RTT) : 12ms\r\n`;
    output += `TraceRoute             : 192.168.1.1, 192.168.1.1, 10.0.0.1, 172.16.0.1, 142.250.185.228\r\n`;
  }

  return { output, exitCode: 0 };
}

// tracert command
export async function tracert(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nUsage: tracert [-d] [-h maximum_hops] target_name\r\n`,
      exitCode: 1,
    };
  }

  const target = args[args.length - 1];
  const hops = 8;
  const noResolve = args.includes('-d');

  let output = `\r\nTracing route to ${target} over a maximum of 30 hops:\r\n\r\n`;

  for (let i = 1; i <= hops; i++) {
    const time1 = Math.floor(Math.random() * 20) + i * 5;
    const time2 = Math.floor(Math.random() * 20) + i * 5;
    const time3 = Math.floor(Math.random() * 20) + i * 5;
    const ip = noResolve ? `192.168.${i}.${Math.floor(Math.random() * 254) + 1}` : `router${i}.isp.com [10.${i}.0.1]`;
    
    output += `  ${i.toString().padStart(2)}    ${time1} ms    ${time2} ms    ${time3} ms  ${ip}\r\n`;
  }

  output += '\r\nTrace complete.\r\n';

  return { output, exitCode: 0 };
}

// pathping command
export async function pathping(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nUsage: pathping target_name\r\n`,
      exitCode: 1,
    };
  }

  const target = args[args.length - 1];
  const hops = 6;

  let output = `\r\nTracing route to ${target} [142.250.185.228]\r\n`;
  output += `Over maximum of 30 hops:\r\n`;
  output += `  0  WIN11-PC [192.168.1.100]\r\n`;

  for (let i = 1; i <= hops; i++) {
    const loss = Math.floor(Math.random() * 10);
    output += `  ${i}  router${i}.isp.com [10.${i}.0.1]\r\n`;
  }

  output += '\r\nComputing statistics for 300 seconds...\r\n';
  output += `                                    Source to Here   This Node/Link\r\n`;
  output += `Hop  RTT   Lost/Sent = Pct  Lost/Sent = Pct  Address\r\n`;
  output += `  0                                           0/ 100 =  0%   WIN11-PC [192.168.1.100]\r\n`;

  for (let i = 1; i <= hops; i++) {
    const loss = Math.floor(Math.random() * 5);
    output += `  ${i}   ${Math.floor(Math.random() * 20 + i * 5)}ms    ${loss}/100 = ${loss}%     ${loss}/100 = ${loss}%   router${i}.isp.com\r\n`;
  }

  output += '\r\nTrace complete.\r\n';

  return { output, exitCode: 0 };
}

// ============================================================================
// DNS Commands
// ============================================================================

// nslookup command
export async function nslookup(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  if (args.length === 0) {
    // Interactive mode
    let output = '\r\n';
    output += 'Default Server:  dns.google\r\n';
    output += 'Address:  8.8.8.8\r\n';
    output += '\r\n';
    output += '> ';
    
    return { output, exitCode: 0 };
  }

  const target = args[args.length - 1];
  
  // Check for interactive subcommands
  if (target === 'exit' || target === 'quit') {
    return { output: '\r\n', exitCode: 0 };
  }

  let output = '\r\n';
  output += 'Server:  dns.google\r\n';
  output += 'Address:  8.8.8.8\r\n\r\n';
  
  // Simulate DNS lookup
  if (/^\d+\.\d+\.\d+\.\d+$/.test(target ?? '')) {
    output += `Name:    www.example.com\r\n`;
    output += `Address:  ${target}\r\n`;
  } else {
    output += `Name:    ${target}\r\n`;
    output += `Address: 142.250.185.228\r\n`;
    output += `\r\nAliases:  www.${target}\r\n`;
  }

  return { output, exitCode: 0 };
}

// Resolve-DnsName - PowerShell command
export async function resolveDnsName(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nResolve-DnsName : Missing the required parameter Name.\r\n`,
      exitCode: 1,
    };
  }

  const target = args[0] ?? '';
  
  let output = '\r\n';
  output += 'Name                                           Type   TTL   Section  IPAddress\r\n';
  output += '----                                           ----   ---   -------  --------\r\n';
  output += `${target.padEnd(54)} A    300   Answer   142.250.185.228\r\n`;
  output += `${target.padEnd(54)} A    300   Answer   142.250.185.196\r\n`;
  output += `${target.padEnd(54)} A    300   Answer   142.250.185.206\r\n`;

  return { output, exitCode: 0 };
}

// ============================================================================
// Active Connections & Ports
// ============================================================================

// netstat command
export async function netstat(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  const showAll = args.includes('-a');
  const showPid = args.includes('-ano') || args.includes('-aon');
  const showNumeric = args.includes('-n');
  
  let output = '\r\nActive Connections\r\n\r\n';
  
  if (showPid) {
    output += '  Proto  Local Address          Foreign Address        State           PID\r\n';
    output += '  -----  -------------          ---------------        -----           ---\r\n';
  } else {
    output += '  Proto  Local Address          Foreign Address        State\r\n';
    output += '  -----  -------------          ---------------        -----\r\n';
  }

  // Simulated connections
  const connections = [
    { proto: 'TCP', local: '192.168.1.100:139', foreign: '192.168.1.1:445', state: 'ESTABLISHED', pid: 4 },
    { proto: 'TCP', local: '192.168.1.100:5040', foreign: '0.0.0.0:0', state: 'LISTENING', pid: 1232 },
    { proto: 'TCP', local: '192.168.1.100:52233', foreign: '142.250.185.228:443', state: 'ESTABLISHED', pid: 4520 },
    { proto: 'TCP', local: '192.168.1.100:62000', foreign: '1.1.1.1:443', state: 'ESTABLISHED', pid: 4520 },
    { proto: 'UDP', local: '192.168.1.100:1900', foreign: '*:*', state: '', pid: 3628 },
    { proto: 'UDP', local: '192.168.1.100:5353', foreign: '*:*', state: '', pid: 3628 },
    { proto: 'UDP', local: '192.168.1.100:62234', foreign: '*:*', state: '', pid: 4520 },
  ];

  for (const conn of connections) {
    if (showPid) {
      output += `  ${conn.proto.padEnd(5)}  ${conn.local.padEnd(24)} ${conn.foreign.padEnd(24)} ${conn.state.padEnd(16)} ${conn.pid}\r\n`;
    } else {
      output += `  ${conn.proto.padEnd(5)}  ${conn.local.padEnd(24)} ${conn.foreign.padEnd(24)} ${conn.state}\r\n`;
    }
  }

  return { output, exitCode: 0 };
}

// Get-NetTCPConnection - PowerShell command
export async function getNetTCPConnection(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  let output = '\r\n';
  output += 'LocalAddress      LocalPort RemoteAddress     RemotePort State       OwningProcess\r\n';
  output += '------------      --------- --------------     ---------- -----       ------------\r\n';
  output += '192.168.1.100     139       192.168.1.1        445        Established 4\r\n';
  output += '192.168.1.100     5040      0.0.0.0            0          Listen      1232\r\n';
  output += '192.168.1.100     52233    142.250.185.228    443        Established 4520\r\n';
  output += '192.168.1.100     62000    1.1.1.1            443        Established 4520\r\n';

  return { output, exitCode: 0 };
}

// Get-NetUDPEndpoint - PowerShell command
export async function getNetUDPEndpoint(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  let output = '\r\n';
  output += 'LocalAddress      LocalPort OwningProcess\r\n';
  output += '------------      --------- ------------\r\n';
  output += '192.168.1.100     1900      3628\r\n';
  output += '192.168.1.100     5353      3628\r\n';
  output += '192.168.1.100     62234     4520\r\n';
  output += '0.0.0.0           500       1232\r\n';
  output += '0.0.0.0           4500      1232\r\n';

  return { output, exitCode: 0 };
}

// ============================================================================
// Routing & ARP Commands
// ============================================================================

// route print command
export async function routePrint(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  let output = '\r\n';
  output += '===========================================================================\r\n';
  output += 'Interface List\r\n';
  output += '  3...00 15 5d 01 23 45 ......Intel(R) Ethernet Connection (2) I219-V\r\n';
  output += '  5...00 15 5d 01 23 46 ......Intel(R) Wireless-AC 9560 160MHz\r\n';
  output += '  1...........................Software Loopback Interface 1\r\n';
  output += '===========================================================================\r\n\r\n';
  output += 'IPv4 Route Table\r\n';
  output += '===========================================================================\r\n';
  output += 'Active Routes:\r\n';
  output += 'Network Destination        Netmask          Gateway       Interface  Metric\r\n';
  output += '              0.0.0.0          0.0.0.0      192.168.1.1   192.168.1.100     25\r\n';
  output += '            127.0.0.0        255.0.0.0         On-link         127.0.0.1    331\r\n';
  output += '            127.0.0.1  255.255.255.255         On-link         127.0.0.1    331\r\n';
  output += '      127.255.255.255  255.255.255.255         On-link         127.0.0.1    331\r\n';
  output += '          192.168.1.0    255.255.255.0         On-link    192.168.1.100    281\r\n';
  output += '        192.168.1.100  255.255.255.255         On-link    192.168.1.100    281\r\n';
  output += '        192.168.1.255  255.255.255.255         On-link    192.168.1.100    281\r\n';
  output += '            224.0.0.0        240.0.0.0         On-link         127.0.0.1    331\r\n';
  output += '            224.0.0.0        240.0.0.0         On-link    192.168.1.100    281\r\n';
  output += '      255.255.255.255  255.255.255.255         On-link         127.0.0.1    331\r\n';
  output += '      255.255.255.255  255.255.255.255         On-link    192.168.1.100    281\r\n';
  output += '===========================================================================\r\n';
  output += 'Persistent Routes:\r\n';
  output += '  None\r\n\r\n';
  output += 'IPv6 Route Table\r\n';
  output += '===========================================================================\r\n';
  output += 'Active Routes:\r\n';
  output += 'If Metric Network Destination      Gateway\r\n';
  output += ' 1    331 ::1/128                  On-link\r\n';
  output += ' 3    281 fe80::/64                On-link\r\n';
  output += ' 3    281 fe80::/64                On-link\r\n';
  output += '===========================================================================\r\n';

  return { output, exitCode: 0 };
}

// Get-NetRoute - PowerShell command
export async function getNetRoute(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  let output = '\r\n';
  output += 'ifIndex DestinationPrefix          NextHop           RouteMetricIfMetric PolicyStore\r\n';
  output += '------- -----------------          -------           ----------- --------\r\n';
  output += '      3 0.0.0.0/0                   192.168.1.1              25 25       ActiveStore\r\n';
  output += '      3 192.168.1.0/24             0.0.0.0                  281 281     ActiveStore\r\n';
  output += '      1 127.0.0.0/8                0.0.0.0                  331 331     ActiveStore\r\n';
  output += '      1 ::1/128                    ::                       331 331     ActiveStore\r\n';
  output += '      3 fe80::/64                  ::                       281 281     ActiveStore\r\n';

  return { output, exitCode: 0 };
}

// arp command
export async function arp(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  const showAll = args.includes('-a');
  
  let output = '\r\n';
  output += 'Internet Address      Physical Address      Type\r\n';
  output += '---------------      ----------------      -----\r\n';
  output += '192.168.1.1          00-1a-2b-3c-4d-5e     dynamic\r\n';
  output += '192.168.1.2          00-1a-2b-3c-4d-6f     dynamic\r\n';
  output += '192.168.1.5          00-1a-2b-3c-4d-70     dynamic\r\n';
  output += '192.168.1.100        00-15-5d-01-23-45     dynamic\r\n';
  output += '192.168.1.255        ff-ff-ff-ff-ff-ff     static\r\n';
  output += '224.0.0.5            01-00-5e-00-00-05     static\r\n';
  output += '224.0.0.22           01-00-5e-00-00-16     static\r\n';
  output += '239.255.255.250      01-00-5e-7f-ff-fa     static\r\n';

  return { output, exitCode: 0 };
}

// ============================================================================
// Network Sharing Commands
// ============================================================================

export async function net(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nThe syntax of this command is:\r\n\r\nNET SHARE\r\nNET USE\r\nNET VIEW\r\nNET CONFIG\r\nNET USER\r\n`,
      exitCode: 1,
    };
  }

  const subcommand = args[0]?.toLowerCase() ?? '';

  switch (subcommand) {
    case 'share':
      return handleNetShare(args.slice(1), session, fs);
    case 'use':
      return handleNetUse(args.slice(1), session, fs);
    case 'view':
      return handleNetView(args.slice(1), session);
    case 'config':
      return handleNetConfig(args.slice(1), session);
    default:
      return {
        output: `\r\nThe option '${subcommand}' is not valid.\r\n`,
        exitCode: 1,
      };
  }
}

function handleNetShare(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): ExecutionResult {
  const deleteShare = args.includes('/delete') || args.includes('/DELETE');
  
  if (deleteShare) {
    const shareNameIndex = args.findIndex(a => a.startsWith('/') && a.toLowerCase() !== '/delete');
    const shareName = shareNameIndex > 0 ? args[shareNameIndex - 1] : args[1];
    return {
      output: `\r\n${shareName} was deleted successfully.\r\n`,
      exitCode: 0,
    };
  }

  if (args.length === 0 || args[0] === '/QUERY') {
    // List all shares
    const shares = fs.getShares();
    
    let output = '\r\nShare name   Resource                        Remark\r\n';
    output += '-------------------------------------------------------------------------------\r\n';
    output += 'C$         C:\\                             Default share\r\n';
    output += 'IPC$                                       Remote IPC\r\n';
    
    shares.forEach(share => {
      output += `${share.name.padEnd(12)} ${share.path.padEnd(31)} ${share.description || ''}\r\n`;
    });
    
    output += 'The command completed successfully.\r\n';
    return { output, exitCode: 0 };
  }

  // Create a new share
  const shareName = args[0] ?? '';
  const path = args.find(a => a.includes(':')) || 'C:\\' + shareName;
  const remark = args.find(a => a.startsWith('/REMARK:') || a.startsWith('/remark:'));

  try {
    fs.createShare(shareName, path, remark ? remark.split(':')[1] : '');
    return {
      output: `\r\n${shareName} was shared successfully.\r\n`,
      exitCode: 0,
    };
  } catch (error) {
    return {
      output: `\r\nError: ${(error instanceof Error ? error.message : String(error))}\r\n`,
      exitCode: 1,
    };
  }
}

function handleNetUse(args: string[], session: TerminalSession, fs: InMemoryFilesystemManager): ExecutionResult {
  const deleteIdx = args.findIndex(a => a.toLowerCase() === '/delete' || a.toLowerCase() === '/d');
  
  if (deleteIdx >= 0) {
    const drive = args[deleteIdx + 1] || args[0];
    return {
      output: `\r\nThe network connection ${drive} was deleted successfully.\r\n`,
      exitCode: 0,
    };
  }

  if (args.length === 0) {
    // List all mapped drives
    let output = '\r\nNew connections will be remembered.\r\n\r\n';
    output += 'Status       Local     Remote                    Network\r\n\r\n';
    output += '-------------------------------------------------------------------------------\r\n';
    output += 'OK           Z:        \\\\SERVER\\Share            Microsoft Windows Network\r\n';
    output += 'OK           Y:        \\\\FILESERVER\\Data         Microsoft Windows Network\r\n';
    output += 'The command completed successfully.\r\n';
    
    return { output, exitCode: 0 };
  }

  const drive = args[0];
  const remotePath = args[1] || args.find(a => a.startsWith('\\\\'));

  if (!remotePath) {
    return {
      output: `\r\nThe syntax of this command is:\r\n\r\nNET USE [devicename] [\\\\computername\\sharename]\r\n`,
      exitCode: 1,
    };
  }

  return {
    output: `\r\n${drive} mapped to ${remotePath}\r\nThe command completed successfully.\r\n`,
    exitCode: 0,
  };
}

function handleNetView(args: string[], session: TerminalSession): ExecutionResult {
  const serverArg = args.find(a => a.startsWith('\\\\'));
  
  if (serverArg) {
    return {
      output: `\r\nShared resources at \\\\${serverArg.slice(2)}\r\n\r\nShare name   Type  Used as  Comment\r\n\r\n------------------------------------\r\nDocuments    Disk           Shared Documents\r\nDownloads    Disk           Shared Downloads\r\nThe command completed successfully.\r\n`,
      exitCode: 0,
    };
  }

  let output = '\r\nServer Name            Remark\r\n\r\n';
  output += '-------------------------------------------------------------------------------\r\n';
  output += `\\\\${session.environmentVariables['COMPUTERNAME']}           Local computer\r\n`;
  output += '\\\\SERVER01              File Server\r\n';
  output += '\\\\SERVER02              Application Server\r\n';
  output += '\\\\FILESERVER            Storage Server\r\n';
  output += 'The command completed successfully.\r\n';

  return { output, exitCode: 0 };
}

function handleNetConfig(args: string[], session: TerminalSession): ExecutionResult {
  return {
    output: '\r\nThe following workstations are logged on:\r\n\r\n\\\\WIN11-PC\r\n\r\nThere are entries in the list.\r\n',
    exitCode: 0,
  };
}

// ============================================================================
// Firewall & Advanced Config Commands
// ============================================================================

// netsh command
export async function netsh(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nUsage: netsh [commands]\r\n\r\nAvailable commands:\r\n  advfirewall    - Configure Windows Firewall with Advanced Security\r\n  int            - Configure network interfaces\r\n  wlan           - Configure wireless LAN\r\n`,
      exitCode: 1,
    };
  }

  const subcommand = args[0]?.toLowerCase() ?? '';

  switch (subcommand) {
    case 'advfirewall':
      return handleNetshAdvFirewall(args.slice(1), session);
    case 'int':
    case 'interface':
      return handleNetshInt(args.slice(1), session);
    default:
      return {
        output: `\r\nThe command was not found.\r\n`,
        exitCode: 1,
      };
  }
}

function handleNetshAdvFirewall(args: string[], session: TerminalSession): ExecutionResult {
  if (args.length === 0 || args[0] === 'show' || args[0] === 'currentprofile') {
    let output = '\r\nDomain Profile Settings:\r\n---------------------------------------------------------------------\r\nState                                 ON\r\nFirewall Policy                       BlockInbound,AllowOutbound\r\nLocalFirewallRules                     N/A (kernel object)\r\nInboundUserNotification               Disable\r\nRemoteManagement                      Disable\r\nUnicastResponseToMulticast            Enable\r\n\r\nPrivate Profile Settings:\r\n---------------------------------------------------------------------\r\nState                                 ON\r\nFirewall Policy                       BlockInbound,AllowOutbound\r\nLocalFirewallRules                     N/A (kernel object)\r\nInboundUserNotification               Disable\r\nRemoteManagement                      Disable\r\nUnicastResponseToMulticast            Enable\r\n\r\nPublic Profile Settings:\r\n---------------------------------------------------------------------\r\nState                                 ON\r\nFirewall Policy                       BlockInbound,AllowOutbound\r\nLocalFirewallRules                     N/A (kernel object)\r\nInboundUserNotification               Disable\r\nRemoteManagement                      Disable\r\nUnicastResponseToMulticast            Enable\r\n\r\nOK.\r\n';
    return { output, exitCode: 0 };
  }

  return { output: '\r\nOK.\r\n', exitCode: 0 };
}

function handleNetshInt(args: string[], session: TerminalSession): ExecutionResult {
  const resetIdx = args.findIndex(a => a.toLowerCase() === 'reset');
  
  if (resetIdx >= 0) {
    return {
      output: `\r\nResetting Global TCP/IP, please wait...\r\n\r\nThe operation completed successfully.\r\nResetting Interface, please wait...\r\n\r\nThe operation completed successfully.\r\n`,
      exitCode: 0,
    };
  }

  return { output: '\r\nOK.\r\n', exitCode: 0 };
}

// ============================================================================
// Other Network Commands
// ============================================================================

// Get-NetConnectionProfile - PowerShell command
export async function getNetConnectionProfile(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  let output = '\r\n';
  output += 'Name             : Network\r\n';
  output += 'InterfaceAlias   : Ethernet\r\n';
  output += 'InterfaceIndex   : 3\r\n';
  output += 'NetworkCategory  : Public\r\n';
  output += 'DomainJoined     : No\r\n';
  output += 'IPv4Connectivity : Internet\r\n';
  output += 'IPv6Connectivity : NoInternet\r\n';

  return { output, exitCode: 0 };
}

// nbtstat command
export async function nbtstat(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  if (args.length === 0) {
    return {
      output: `\r\nUsage: nbtstat -a [IP] | -n\r\n`,
      exitCode: 1,
    };
  }

  const target = args[args.length - 1];
  const showName = args.includes('-n');
  
  if (showName) {
    let output = '\r\nNode IpAddress: [192.168.1.100] Scope Id: []\r\n\r\n';
    output += 'NetBIOS Remote Machine Name Table\r\n\r\n';
    output += '       Name               Type         Status\r\n';
    output += '    -----------------------------------------------\r\n';
    output += '    WIN11-PC       <00>  UNIQUE      Registered\r\n';
    output += '    WIN11-PC       <20>  UNIQUE      Registered\r\n';
    output += '    WORKGROUP      <00>  GROUP       Registered\r\n';
    output += '    WORKGROUP      <1E>  GROUP       Registered\r\n';
    output += '    MAC Address = 00-15-5D-01-23-45\r\n';
    return { output, exitCode: 0 };
  }

  let output = `\r\nNode IpAddress: [192.168.1.100] Scope Id: []\r\n\r\n`;
  output += `NetBIOS Remote Machine Name Table for Target: ${target}\r\n\r\n`;
  output += '       Name               Type         Status\r\n';
  output += '    -----------------------------------------------\r\n';
  output += `    SERVER01       <00>  UNIQUE      Registered\r\n`;
  output += `    SERVER01       <20>  UNIQUE      Registered\r\n`;
  output += `    DOMAIN         <00>  GROUP       Registered\r\n`;
  output += '    MAC Address = 00-1A-2B-3C-4D-5E\r\n';

  return { output, exitCode: 0 };
}

// hostname command - uses environment variable for consistency
export async function hostname(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  const hostname = session.environmentVariables['COMPUTERNAME'] || 'WIN11-PC';
  return {
    output: `\r\n${hostname}\r\n`,
    exitCode: 0,
  };
}

// getmac command
export async function getmac(args: string[], session: TerminalSession): Promise<ExecutionResult> {
  const format = args.includes('/v') ? 'verbose' : 'simple';
  
  if (format === 'verbose') {
    let output = '\r\n';
    output += 'Transport Name                             MAC Address       =============\r\n';
    output += 'PCI\\VEN_8086&DEV_15B8&SUBSYS_00008086&REV_00\\3&11583659&0&C8  00-15-5D-01-23-45  Ethernet\r\n';
    output += 'PCI\\VEN_8086&DEV_15B8&SUBSYS_00008086&REV_00\\3&11583659&0&C9  00-15-5D-01-23-46  Wi-Fi\r\n';
    output += 'BTH\\MAC\\00155D012346                         00-15-5D-01-23-47  Bluetooth\r\n';
    return { output, exitCode: 0 };
  }

  let output = '\r\n';
  output += 'Media State     : Media disconnected\r\n';
  output += 'Connection-specific DNS Suffix  : \r\n';
  output += 'MAC Address     : 00-15-5D-01-23-45\r\n';
  output += '\r\n';
  output += 'Media State     : Media disconnected\r\n';
  output += 'Connection-specific DNS Suffix  : \r\n';
  output += 'MAC Address     : 00-15-5D-01-23-46\r\n';
  output += '\r\n';
  output += 'Media State     : Media disconnected\r\n';
  output += 'Connection-specific DNS Suffix  : \r\n';
  output += 'MAC Address     : 00-15-5D-01-23-47\r\n';

  return { output, exitCode: 0 };
}
