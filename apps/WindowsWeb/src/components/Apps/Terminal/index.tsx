'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Tab, TabList, Tabs, Text, VStack } from '@chakra-ui/react';
import { FiPlus, FiX, FiChevronDown } from 'react-icons/fi';
import { SiPowershell, SiWindowsterminal } from 'react-icons/si';
import type { Terminal as XTermType } from '@xterm/xterm';
import type { FitAddon as FitAddonType } from '@xterm/addon-fit';
import type { Socket } from 'socket.io-client';

interface TerminalTab {
  id: string;
  title: string;
  shell: 'powershell' | 'cmd';
  terminal: XTermType;
  fitAddon: FitAddonType;
  historyIndex: number;
  currentInput: string;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

export function Terminal() {
  const [tabs, setTabs] = useState<TerminalTab[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const terminalContainersRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const pendingCompletionRef = useRef<{ resolve: (value: string[]) => void } | null>(null);
  const activeTabIndexRef = useRef(0);

  // Keep ref in sync with state
  useEffect(() => {
    activeTabIndexRef.current = activeTabIndex;
  }, [activeTabIndex]);

  useEffect(() => {
    // Connect to server
    let socket: Socket;
    
    (async () => {
      const { io } = await import('socket.io-client');
      socket = io(SERVER_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Terminal: Connected to terminal server');
      });

      socket.on('terminal-output', (output: string) => {
        const currentIndex = activeTabIndexRef.current;
        const currentTab = tabs[currentIndex];
        if (currentTab) {
          currentTab.terminal.write(output);
        }
      });

      socket.on('terminal-ready', (data: { sessionId: string; shell: string }) => {
        console.log('Terminal ready:', data);
      });

      socket.on('terminal-error', (error: { message: string }) => {
        console.error('Terminal error:', error);
      });

      socket.on('history-response', (data: { history: string[]; size: number }) => {
        console.log('History loaded:', data.size, 'items');
      });

      socket.on('history-item', (data: { item: string; index: number }) => {
        const currentIndex = activeTabIndexRef.current;
        const currentTab = tabs[currentIndex];
        if (currentTab && socketRef.current) {
          currentTab.terminal.write('\x1b[2K\r' + data.item + '\r\n');
          currentTab.historyIndex = data.index;
          
          // Request new prompt after showing history item
          setTimeout(() => {
            if (socketRef.current?.connected) {
              socketRef.current.emit('create-terminal-session', { 
                sessionId: currentTab.id, 
                shell: currentTab.shell 
              });
            }
          }, 50);
        }
      });

      socket.on('completion-response', (data: { completions: string[] }) => {
        if (pendingCompletionRef.current) {
          pendingCompletionRef.current.resolve(data.completions);
          pendingCompletionRef.current = null;
        }
      });
    })();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Fit terminal when active tab changes
    const currentTab = tabs[activeTabIndex];
    if (currentTab) {
      setTimeout(() => {
        currentTab.fitAddon.fit();
      }, 50);
    }
  }, [activeTabIndex, tabs]);

  // Request completion from server
  const requestCompletion = useCallback(async (sessionId: string, input: string): Promise<string[]> => {
    if (!socketRef.current) return [];
    
    return new Promise((resolve) => {
      pendingCompletionRef.current = { resolve };
      socketRef.current!.emit('request-completion', { sessionId, input });
      
      // Timeout after 500ms
      setTimeout(() => {
        if (pendingCompletionRef.current) {
          pendingCompletionRef.current.resolve([]);
          pendingCompletionRef.current = null;
        }
      }, 500);
    });
  }, []);

  // Navigate history
  const navigateHistory = useCallback(async (sessionId: string, direction: 'up' | 'down') => {
    if (!socketRef.current) return;
    
    const currentTab = tabs[activeTabIndexRef.current];
    if (!currentTab) return;

    socketRef.current.emit('navigate-history', { 
      sessionId, 
      direction, 
      currentIndex: currentTab.historyIndex 
    });
  }, [tabs]);

  const createNewTab = async (shell: 'powershell' | 'cmd') => {
    const sessionId = `terminal-${Date.now()}`;
    const title = shell === 'powershell' ? 'PowerShell' : 'Command Prompt';

    // Dynamically import xterm modules
    const { Terminal: XTerm } = await import('@xterm/xterm');
    const { FitAddon } = await import('@xterm/addon-fit');
    const { WebLinksAddon } = await import('@xterm/addon-web-links');

    // Create xterm instance
    const terminal = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Cascadia Code, Consolas, monospace',
      theme: {
        background: shell === 'powershell' ? '#012456' : '#0C0C0C',
        foreground: shell === 'powershell' ? '#CCCCCC' : '#C0C0C0',
        cursor: '#FFFFFF',
        cursorAccent: '#000000',
        black: '#0C0C0C',
        red: '#C50F1F',
        green: '#13A10E',
        yellow: '#C19C00',
        blue: '#0037DA',
        magenta: '#881798',
        cyan: '#3A96DD',
        white: '#CCCCCC',
        brightBlack: '#767676',
        brightRed: '#E74856',
        brightGreen: '#16C60C',
        brightYellow: '#F9F1A5',
        brightBlue: '#3B78FF',
        brightMagenta: '#B4009E',
        brightCyan: '#61D6D6',
        brightWhite: '#F2F2F2',
      },
      allowTransparency: true,
      rows: 30,
      cols: 100,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    const newTab: TerminalTab = {
      id: sessionId,
      title,
      shell,
      terminal,
      fitAddon,
      historyIndex: 0,
      currentInput: '',
    };

    setTabs(prev => {
      const updated = [...prev, newTab];
      setActiveTabIndex(updated.length - 1);
      return updated;
    });

    // Wait for the container to be rendered
    setTimeout(() => {
      const container = terminalContainersRef.current.get(sessionId);
      if (container) {
        terminal.open(container);
        fitAddon.fit();

        // Track current input buffer
        let inputBuffer = '';

        // Handle terminal input
        terminal.onData((data) => {
          const charCode = data.charCodeAt(0);

          // Handle Tab for completion
          if (charCode === 9) { // Tab key
            handleTabCompletion(terminal, sessionId, inputBuffer);
            return;
          }

          // Handle Ctrl+C
          if (charCode === 3) {
            terminal.write('\r\n^C\r\n');
            inputBuffer = '';
            if (socketRef.current) {
              socketRef.current.emit('terminal-input', { sessionId, input: data });
            }
            return;
          }

          // Handle Enter
          if (charCode === 13) {
            terminal.write('\r\n');
            inputBuffer = '';
            // Reset history index on enter
            setTabs(prev => prev.map((tab, i) => 
              i === activeTabIndexRef.current ? { ...tab, historyIndex: 0 } : tab
            ));
            if (socketRef.current) {
              socketRef.current.emit('terminal-input', { sessionId, input: data });
            }
            return;
          }

          // Handle Backspace
          if (charCode === 127 || charCode === 8) {
            if (inputBuffer.length > 0) {
              inputBuffer = inputBuffer.slice(0, -1);
              terminal.write('\b \b');
            }
            return;
          }

          // Handle arrow keys for history navigation
          if (charCode === 27) {
            // Escape sequence - check for arrow keys
            if (data.length > 1) {
              const arrowKey = data.substring(1);
              if (arrowKey === '[A') { // Arrow Up
                navigateHistory(sessionId, 'up');
                return;
              } else if (arrowKey === '[B') { // Arrow Down
                navigateHistory(sessionId, 'down');
                return;
              } else if (arrowKey === '[C') { // Right
                return;
              } else if (arrowKey === '[D') { // Left
                return;
              }
            }
            return;
          }

          // Handle printable characters
          if (data >= ' ' && data <= '~') {
            inputBuffer += data;
            terminal.write(data);
          }
        });

        // Request terminal session from server
        if (socketRef.current) {
          socketRef.current.emit('create-terminal-session', { sessionId, shell });
        }
      }
    }, 100);
  };

  // Handle Tab completion
  const handleTabCompletion = async (terminal: XTermType, sessionId: string, currentInput: string) => {
    // Get cursor position by requesting it from xterm
    // For simplicity, we'll complete based on the current input buffer
    
    const completions = await requestCompletion(sessionId, currentInput);
    
    if (completions.length === 0) {
      // No completions, do nothing (or could beep)
      return;
    }

    if (completions.length === 1) {
      // Single completion - auto-complete
      const completion = completions[0] ?? '';
      const parts = currentInput.split(/(\s+)/);
      const lastPart = parts[parts.length - 1] || '';
      const completionToAdd = completion.replace(/\\$/, '');
      
      if (lastPart) {
        terminal.write(completionToAdd.slice(lastPart.length));
      }
    } else if (completions.length > 1) {
      // Multiple completions - show them
      terminal.write('\r\n');
      completions.forEach((completion) => {
        terminal.write(completion + '  ');
      });
      terminal.write('\r\n');
      
      // Reprint prompt
      if (socketRef.current) {
        setTimeout(() => {
          socketRef.current?.emit('create-terminal-session', { 
            sessionId, 
            shell: tabs[activeTabIndexRef.current]?.shell || 'powershell' 
          });
        }, 50);
      }
    }
  };

  const closeTab = (index: number) => {
    const tabToClose = tabs[index];
    
    if (tabToClose) {
      // Notify server to destroy session
      if (socketRef.current) {
        socketRef.current.emit('destroy-terminal-session', { sessionId: tabToClose.id });
      }

      // Dispose terminal
      tabToClose.terminal.dispose();
      terminalContainersRef.current.delete(tabToClose.id);

      // Remove tab
      setTabs(prev => {
        const updated = prev.filter((_, i) => i !== index);
        if (activeTabIndex >= index && activeTabIndex > 0 && updated.length > 0) {
          setActiveTabIndex(Math.min(activeTabIndex - 1, updated.length - 1));
        } else if (updated.length > 0) {
          setActiveTabIndex(Math.max(0, updated.length - 1));
        }
        return updated;
      });
    }
  };

  return (
    <Box height="100%" display="flex" flexDirection="column" bg="gray.900">
      {/* Tab bar */}
      <HStack
        spacing={0}
        bg="gray.800"
        px={2}
        py={1}
        borderBottom="1px solid"
        borderColor="gray.700"
      >
        <Tabs
          index={activeTabIndex}
          onChange={setActiveTabIndex}
          variant="unstyled"
          flex={1}
          size="sm"
        >
          <TabList>
            {tabs.map((tab, index) => (
              <Tab
                key={tab.id}
                bg={activeTabIndex === index ? 'gray.700' : 'transparent'}
                color="white"
                fontSize="sm"
                px={3}
                py={1}
                mr={1}
                borderRadius="md"
                _hover={{ bg: 'gray.700' }}
              >
                <HStack spacing={2}>
                  {tab.shell === 'powershell' ? <SiPowershell size={14} /> : <SiWindowsterminal size={14} />}
                  <Text>{tab.title}</Text>
                  <IconButton
                    aria-label="Close tab"
                    icon={<FiX />}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: 'white', bg: 'gray.600' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(index);
                    }}
                  />
                </HStack>
              </Tab>
            ))}
          </TabList>
        </Tabs>

        {/* New tab button */}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="New tab"
            icon={<HStack spacing={1}><FiPlus /><FiChevronDown size={12} /></HStack>}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: 'gray.700' }}
          />
          <MenuList bg="gray.800" borderColor="gray.700">
            <MenuItem
              icon={<SiPowershell />}
              bg="gray.800"
              _hover={{ bg: 'gray.700' }}
              color="white"
              onClick={() => createNewTab('powershell')}
            >
              PowerShell
            </MenuItem>
            <MenuItem
              icon={<SiWindowsterminal />}
              bg="gray.800"
              _hover={{ bg: 'gray.700' }}
              color="white"
              onClick={() => createNewTab('cmd')}
            >
              Command Prompt
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Terminal panels */}
      <Box flex={1} position="relative" overflow="hidden">
        {tabs.map((tab, index) => (
          <Box
            key={tab.id}
            ref={(el) => {
              if (el) {
                terminalContainersRef.current.set(tab.id, el);
              }
            }}
            display={activeTabIndex === index ? 'block' : 'none'}
            height="100%"
            width="100%"
            p={2}
          />
        ))}
      </Box>
    </Box>
  );
}
