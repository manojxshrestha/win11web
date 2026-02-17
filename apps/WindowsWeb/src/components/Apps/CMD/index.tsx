'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import type { Terminal as XTermType } from '@xterm/xterm';
import type { FitAddon as FitAddonType } from '@xterm/addon-fit';
import type { Socket } from 'socket.io-client';

interface CMDTab {
  id: string;
  title: string;
  shell: 'cmd';
  terminal: XTermType;
  fitAddon: FitAddonType;
  historyIndex: number;
  currentInput: string;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

export function CMD() {
  const [tabs, setTabs] = useState<CMDTab[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const terminalContainersRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const pendingCompletionRef = useRef<{ resolve: (value: string[]) => void } | null>(null);
  const activeTabIndexRef = useRef(0);
  const isCreatingTabRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    activeTabIndexRef.current = activeTabIndex;
  }, [activeTabIndex]);

  // Initialize socket connection
  useEffect(() => {
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
        console.log('CMD: Connected to terminal server');
      });

      socket.on('terminal-output', (output: string) => {
        const currentIndex = activeTabIndexRef.current;
        const currentTab = tabs[currentIndex];
        if (currentTab) {
          currentTab.terminal.write(output);
        }
      });

      socket.on('terminal-ready', () => {
        console.log('CMD: Terminal ready');
      });

      socket.on('terminal-error', (error: { message: string }) => {
        console.error('CMD: Terminal error:', error);
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
                shell: 'cmd' 
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

      // Create initial tab after socket connection
      if (!isCreatingTabRef.current && tabs.length === 0) {
        isCreatingTabRef.current = true;
        createNewTab(socket);
      }
    })();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const currentTab = tabs[activeTabIndex];
    if (currentTab) {
      setTimeout(() => {
        currentTab.fitAddon.fit();
      }, 50);
    }
  }, [activeTabIndex, tabs]);

  const requestCompletion = useCallback(async (sessionId: string, input: string): Promise<string[]> => {
    if (!socketRef.current) return [];
    
    return new Promise((resolve) => {
      pendingCompletionRef.current = { resolve };
      socketRef.current!.emit('request-completion', { sessionId, input });
      
      setTimeout(() => {
        if (pendingCompletionRef.current) {
          pendingCompletionRef.current.resolve([]);
          pendingCompletionRef.current = null;
        }
      }, 500);
    });
  }, []);

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

  const createNewTab = async (socket?: Socket) => {
    const sessionId = `cmd-${Date.now()}`;
    const title = 'Command Prompt';

    const { Terminal: XTerm } = await import('@xterm/xterm');
    const { FitAddon } = await import('@xterm/addon-fit');
    const { WebLinksAddon } = await import('@xterm/addon-web-links');

    const terminal = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Consolas, monospace',
      theme: {
        background: '#0C0C0C',
        foreground: '#C0C0C0',
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

    const newTab: CMDTab = {
      id: sessionId,
      title,
      shell: 'cmd',
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

    setTimeout(() => {
      const container = terminalContainersRef.current.get(sessionId);
      if (container) {
        terminal.open(container);
        fitAddon.fit();

        let inputBuffer = '';

        terminal.onData((data: string) => {
          const charCode = data.charCodeAt(0);

          if (charCode === 9) { // Tab
            handleTabCompletion(terminal, sessionId, inputBuffer);
            return;
          }

          if (charCode === 3) { // Ctrl+C
            terminal.write('\r\n^C\r\n');
            inputBuffer = '';
            if (socketRef.current) {
              socketRef.current.emit('terminal-input', { sessionId, input: data });
            }
            return;
          }

          if (charCode === 13) { // Enter
            terminal.write('\r\n');
            inputBuffer = '';
            setTabs(prev => prev.map((tab, i) => 
              i === activeTabIndexRef.current ? { ...tab, historyIndex: 0 } : tab
            ));
            if (socketRef.current) {
              socketRef.current.emit('terminal-input', { sessionId, input: data });
            }
            return;
          }

          if (charCode === 127 || charCode === 8) { // Backspace
            if (inputBuffer.length > 0) {
              inputBuffer = inputBuffer.slice(0, -1);
              terminal.write('\b \b');
            }
            return;
          }

          if (charCode === 27) { // Arrow keys
            if (data.length > 1) {
              const arrowKey = data.substring(1);
              if (arrowKey === '[A') { // Up
                navigateHistory(sessionId, 'up');
                return;
              } else if (arrowKey === '[B') { // Down
                navigateHistory(sessionId, 'down');
                return;
              } else if (arrowKey === '[C') { // Right
                // Could implement partial word navigation
                return;
              } else if (arrowKey === '[D') { // Left
                // Could implement partial word navigation
                return;
              }
            }
            return;
          }

          if (data >= ' ' && data <= '~') {
            inputBuffer += data;
            terminal.write(data);
          }
        });

        const s = socket || socketRef.current;
        if (s && s.connected) {
          s.emit('create-terminal-session', { sessionId, shell: 'cmd' });
        } else if (s) {
          s.once('connect', () => {
            s.emit('create-terminal-session', { sessionId, shell: 'cmd' });
          });
        }
      }
    }, 100);
  };

  const handleTabCompletion = async (terminal: XTermType, sessionId: string, currentInput: string) => {
    const completions = await requestCompletion(sessionId, currentInput);
    
    if (completions.length === 0) return;

    if (completions.length === 1) {
      const completion = completions[0];
      const parts = currentInput.split(/(\s+)/);
      const lastPart = parts[parts.length - 1] || '';
      const completionToAdd = completion?.replace(/\\$/, '');
      
      if (lastPart) {
        terminal.write(completionToAdd?.slice(lastPart.length) || '');
      }
    } else if (completions.length > 1) {
      terminal.write('\r\n');
      completions.forEach((completion: string) => {
        terminal.write(completion + '  ');
      });
      terminal.write('\r\n');
      
      if (socketRef.current && socketRef.current.connected) {
        setTimeout(() => {
          socketRef.current?.emit('create-terminal-session', { sessionId, shell: 'cmd' });
        }, 50);
      }
    }
  };

  const closeTab = (index: number) => {
    const tabToClose = tabs[index];
    
    if (tabToClose) {
      if (socketRef.current) {
        socketRef.current.emit('destroy-terminal-session', { sessionId: tabToClose.id });
      }

      tabToClose.terminal.dispose();
      terminalContainersRef.current.delete(tabToClose.id);

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
    <Box height="100%" display="flex" flexDirection="column" bg="#0C0C0C">
      {/* Tab bar */}
      <HStack
        spacing={0}
        bg="#1a1a1a"
        px={2}
        py={1}
        borderBottom="1px solid"
        borderColor="#333"
      >
        {tabs.map((tab, index) => (
          <HStack
            key={tab.id}
            bg={activeTabIndex === index ? '#2d2d2d' : 'transparent'}
            color="white"
            fontSize="sm"
            px={3}
            py={1}
            mr={1}
            borderRadius="md"
            _hover={{ bg: activeTabIndex === index ? '#2d2d2d' : '#333' }}
            cursor="pointer"
            onClick={() => setActiveTabIndex(index)}
          >
            <Text>C:\</Text>
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
        ))}
      </HStack>

      {/* Terminal panel */}
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
