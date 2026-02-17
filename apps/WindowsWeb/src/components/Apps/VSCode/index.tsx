'use client';

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  FiFile,
  FiFolder,
  FiSearch,
  FiGitBranch,
  FiSettings,
  FiPlus,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiCode,
  FiFileText,
  FiTerminal,
  FiLayout,
  FiRefreshCw,
} from 'react-icons/fi';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  language?: string;
}

const initialFileTree: FileItem[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: '3',
            name: 'App.tsx',
            type: 'file',
            language: 'typescript',
            content: `import React from 'react';\n\nexport function App() {\n  return (\n    <div>Hello World</div>\n  );\n}`,
          },
          {
            id: '4',
            name: 'Button.tsx',
            type: 'file',
            language: 'typescript',
            content: `interface ButtonProps {\n  label: string;\n  onClick: () => void;\n}\n\nexport function Button({ label, onClick }: ButtonProps) {\n  return (\n    <button onClick={onClick}>\n      {label}\n    </button>\n  );\n}`,
          },
        ],
      },
      {
        id: '5',
        name: 'App.ts',
        type: 'file',
        language: 'typescript',
        content: `import { App } from './components/App';\n\nrender(<App />);`,
      },
      {
        id: '6',
        name: 'index.css',
        type: 'file',
        language: 'css',
        content: `body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}`,
      },
    ],
  },
  {
    id: '7',
    name: 'package.json',
    type: 'file',
    language: 'json',
    content: `{\n  "name": "my-project",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0"\n  }\n}`,
  },
  {
    id: '8',
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    content: `# My Project\n\nThis is a sample project.\n\n## Features\n- Feature 1\n- Feature 2`,
  },
];

export function VSCode() {
  const [fileTree] = useState<FileItem[]>(initialFileTree);
  const [activeFile, setActiveFile] = useState<FileItem | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1']));
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = useColorModeValue('#1e1e1e', '#1e1e1e');
  const sidebarBg = useColorModeValue('#252526', '#252526');
  const activityBarBg = useColorModeValue('#333333', '#333333');
  const textColor = useColorModeValue('#d4d4d4', '#d4d4d4');
  const hoverBg = useColorModeValue('#2a2d2e', '#2a2d2e');
  const selectionBg = useColorModeValue('#094771', '#094771');
  const borderColor = useColorModeValue('#3c3c3c', '#3c3c3c');
  const tabBg = useColorModeValue('#2d2d2d', '#2d2d2d');

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const renderFileTree = (items: FileItem[], depth = 0): JSX.Element[] => {
    return items.map(item => (
      <Box key={item.id}>
        <HStack
          px={2}
          py={1}
          ml={depth * 12}
          cursor="pointer"
          _hover={{ bg: hoverBg }}
          bg={activeFile?.id === item.id ? selectionBg : 'transparent'}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              setActiveFile(item);
            }
          }}
          spacing={1}
        >
          {item.type === 'folder' ? (
            expandedFolders.has(item.id) ? (
              <FiChevronDown size={14} color={textColor} />
            ) : (
              <FiChevronRight size={14} color={textColor} />
            )
          ) : (
            <Box w="14px" />
          )}
          {item.type === 'folder' ? (
            <FiFolder color="#dcb67a" size={16} />
          ) : (
            <FiFileText color={textColor} size={16} />
          )}
          <Text color={textColor} fontSize="sm" noOfLines={1}>
            {item.name}
          </Text>
        </HStack>
        {item.type === 'folder' && expandedFolders.has(item.id) && item.children && (
          <Box>
            {renderFileTree(item.children, depth + 1)}
          </Box>
        )}
      </Box>
    ));
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return '📘';
    if (name.endsWith('.css')) return '🎨';
    if (name.endsWith('.json')) return '📋';
    if (name.endsWith('.md')) return '📝';
    return '📄';
  };

  const getLanguageColor = (lang?: string) => {
    switch (lang) {
      case 'typescript': return '#3178c6';
      case 'css': return '#563d7c';
      case 'json': return '#f5a623';
      case 'markdown': return '#4381d1';
      default: return textColor;
    }
  };

  return (
    <Flex h="100%" bg={bgColor} direction="column">
      {/* Title Bar */}
      <HStack
        px={4}
        py={2}
        bg={tabBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        justify="space-between"
      >
        <HStack spacing={4}>
          <FiCode color="#007acc" size={20} />
          <Text color={textColor} fontSize="sm" fontWeight="medium">
            Visual Studio Code
          </Text>
        </HStack>
        <HStack spacing={4}>
          <HStack spacing={2} px={3} py={1} bg={bgColor} borderRadius="md">
            <FiFile size={14} color={textColor} />
            <Text color={textColor} fontSize="xs">File</Text>
          </HStack>
          <HStack spacing={2} px={3} py={1} bg="transparent">
            <FiSearch size={14} color={textColor} />
            <Text color={textColor} fontSize="xs">Edit</Text>
          </HStack>
          <HStack spacing={2} px={3} py={1} bg="transparent">
            <FiLayout size={14} color={textColor} />
            <Text color={textColor} fontSize="xs">View</Text>
          </HStack>
          <HStack spacing={2} px={3} py={1} bg="transparent">
            <FiGitBranch size={14} color={textColor} />
            <Text color={textColor} fontSize="xs">Source Control</Text>
          </HStack>
        </HStack>
      </HStack>

      {/* Main Content */}
      <Flex flex={1} overflow="hidden">
        {/* Activity Bar */}
        <VStack
          w="48px"
          bg={activityBarBg}
          py={2}
          spacing={2}
        >
          <Tooltip label="Explorer" placement="right">
            <IconButton
              aria-label="Explorer"
              icon={<FiFile />}
              variant="ghost"
              color={textColor}
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Search" placement="right">
            <IconButton
              aria-label="Search"
              icon={<FiSearch />}
              variant="ghost"
              color={textColor}
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Source Control" placement="right">
            <IconButton
              aria-label="Git"
              icon={<FiGitBranch />}
              variant="ghost"
              color={textColor}
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Extensions" placement="right">
            <IconButton
              aria-label="Extensions"
              icon={<FiLayout />}
              variant="ghost"
              color={textColor}
              size="sm"
            />
          </Tooltip>
          <Box flex={1} />
          <Tooltip label="Settings" placement="right">
            <IconButton
              aria-label="Settings"
              icon={<FiSettings />}
              variant="ghost"
              color={textColor}
              size="sm"
            />
          </Tooltip>
        </VStack>

        {/* Sidebar */}
        <Box w="250px" bg={sidebarBg} overflowY="auto">
          <VStack align="stretch" spacing={2}>
            {/* Explorer Header */}
            <HStack px={3} py={2} justify="space-between">
              <Text color={textColor} fontSize="xs" fontWeight="bold" textTransform="uppercase">
                Explorer
              </Text>
              <HStack spacing={1}>
                <IconButton
                  aria-label="New File"
                  icon={<FiPlus />}
                  variant="ghost"
                  color={textColor}
                  size="xs"
                />
                <IconButton
                  aria-label="New Folder"
                  icon={<FiFolder />}
                  variant="ghost"
                  color={textColor}
                  size="xs"
                />
              </HStack>
            </HStack>

            {/* Project Name */}
            <HStack px={3} py={1}>
              <FiChevronDown size={14} color={textColor} />
              <Text color={textColor} fontSize="sm" fontWeight="bold">
                MY-PROJECT
              </Text>
            </HStack>

            {/* Search */}
            <Input
              placeholder="Search"
              size="xs"
              mx={3}
              bg={bgColor}
              border="none"
              color={textColor}
              _placeholder={{ color: 'gray.500' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* File Tree */}
            <Box px={1}>
              {renderFileTree(fileTree)}
            </Box>
          </VStack>
        </Box>

        {/* Editor Area */}
        <Flex flex={1} direction="column" overflow="hidden">
          {activeFile ? (
            <>
              {/* Tabs */}
              <HStack
                px={2}
                py={1}
                bg={tabBg}
                borderBottom="1px solid"
                borderColor={borderColor}
                overflowX="auto"
              >
                <HStack
                  px={3}
                  py={2}
                  bg={bgColor}
                  borderTop="2px solid"
                  borderTopColor="orange.400"
                  spacing={2}
                >
                  <Text>{getFileIcon(activeFile.name)}</Text>
                  <Text color={textColor} fontSize="sm">
                    {activeFile.name}
                  </Text>
                  <IconButton
                    aria-label="Close"
                    icon={<FiX />}
                    variant="ghost"
                    size="xs"
                    color={textColor}
                    onClick={() => setActiveFile(null)}
                  />
                </HStack>
              </HStack>

              {/* Line Numbers and Code */}
              <Flex flex={1} overflow="hidden">
                {/* Line Numbers */}
                <VStack
                  w="50px"
                  py={4}
                  px={2}
                  bg={bgColor}
                  borderRight="1px solid"
                  borderColor={borderColor}
                  align="flex-end"
                  spacing={0}
                >
                  {activeFile.content?.split('\n').map((_, i) => (
                    <Text key={i} color="#858585" fontSize="sm" lineHeight="1.5">
                      {i + 1}
                    </Text>
                  ))}
                </VStack>

                {/* Code Content */}
                <Box
                  flex={1}
                  p={4}
                  overflow="auto"
                  fontFamily="Consolas, Monaco, monospace"
                  fontSize="14px"
                  lineHeight="1.5"
                  color={textColor}
                  whiteSpace="pre"
                >
                  {activeFile.content?.split('\n').map((line, i) => (
                    <Box key={i}>
                      {line.split(/(\s+|[(){}[\]]|,|;)/g).map((part, j) => {
                        // Simple syntax highlighting
                        let color = textColor;
                        let fontWeight = 'normal';

                        if (/^\s*$/.test(part)) {
                          return <span key={j}>{part}</span>;
                        }

                        if (/^(import|export|function|const|let|var|interface|type|class|return|if|else|for|while|switch|case|default|break|continue)$/.test(part)) {
                          color = '#569cd6';
                          fontWeight = 'bold';
                        } else if (/^(true|false|null|undefined|NaN)$/.test(part)) {
                          color = '#569cd6';
                        } else if (/^['"`].*['"`]$/.test(part)) {
                          color = '#ce9178';
                        } else if (/^\d+/.test(part)) {
                          color = '#b5cea8';
                        } else if (/^\/\/.*$/.test(part) || /^\/\*[\s\S]*\*\/$/.test(part)) {
                          color = '#6a9955';
                        } else if (/^(React|from|as|extends|new|this|super|async|await|try|catch|finally|throw)$/.test(part)) {
                          color = '#c586c0';
                        } else if (/^{|}$/.test(part)) {
                          color = '#ffd700';
                        } else if (/^\(|\)$/.test(part)) {
                          color = '#ffd700';
                        } else if (/^\[|\]$/.test(part)) {
                          color = '#ffd700';
                        } else if (/^(string|number|boolean|void|any|never)$/.test(part)) {
                          color = '#4ec9b0';
                        }

                        return (
                          <span key={j} style={{ color, fontWeight }}>
                            {part}
                          </span>
                        );
                      })}
                    </Box>
                  ))}
                </Box>
              </Flex>
            </>
          ) : (
            <Flex flex={1} align="center" justify="center" direction="column">
              <FiCode size={64} color="#424242" />
              <Text color={textColor} fontSize="xl" mt={4}>
                Welcome to VS Code
              </Text>
              <Text color="#666" fontSize="sm" mt={2}>
                Select a file to view its contents
              </Text>
            </Flex>
          )}
        </Flex>

        {/* Terminal Panel */}
        <Box
          h="150px"
          bg={bgColor}
          borderTop="1px solid"
          borderColor={borderColor}
        >
          <HStack px={3} py={1} borderBottom="1px solid" borderColor={borderColor}>
            <Text color={textColor} fontSize="xs" fontWeight="bold">
              Terminal
            </Text>
            <Text color={textColor} fontSize="xs">Problems</Text>
            <Text color={textColor} fontSize="xs">Output</Text>
            <Text color={textColor} fontSize="xs">Debug Console</Text>
          </HStack>
          <Box p={3} fontFamily="Consolas, monospace" fontSize="sm" color={textColor}>
            <Text>
              <Text as="span" color="#4ec9b0">➜</Text>{' '}
              <Text as="span" color="#569cd6">my-project</Text>{' '}
              <Text as="span" color="#d4d4d4">git:(main)</Text>{' '}
              <Text as="span" color="#4ec9b0">✗</Text>
            </Text>
            <Text mt={2}>
              <Text as="span" color="#4ec9b0">➜</Text>{' '}
              <Text as="span" color="#d4d4d4">npm install</Text>
            </Text>
            <Text color="#6a9955">added 127 packages in 2s</Text>
          </Box>
        </Box>
      </Flex>

      {/* Status Bar */}
      <HStack
        px={4}
        py={1}
        bg="#007acc"
        justify="space-between"
        fontSize="xs"
      >
        <HStack spacing={4}>
          <HStack spacing={1}>
            <FiGitBranch size={12} />
            <Text>main</Text>
          </HStack>
          <HStack spacing={1}>
            <FiRefreshCw size={12} />
            <Text>0</Text>
            <Text color="yellow.200">0</Text>
          </HStack>
        </HStack>
        <HStack spacing={4}>
          <Text>Ln 1, Col 1</Text>
          <Text>UTF-8</Text>
          <Text>{activeFile?.language || 'Plain Text'}</Text>
          <Text>{activeFile ? 'Prettier' : ''}</Text>
        </HStack>
      </HStack>
    </Flex>
  );
}

export default VSCode;
