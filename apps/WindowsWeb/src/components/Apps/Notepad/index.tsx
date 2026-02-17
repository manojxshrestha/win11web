'use client';

import {
  Box,
  Flex,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Text,
  useColorModeValue,
  Tooltip,
  Button,
  Input,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FiFile,
  FiFolder,
  FiSave,
  FiFolderPlus,
  FiCopy,
  FiScissors,
  FiRotateCw,
  FiRefreshCw,
  FiPlus,
  FiX,
  FiSearch,
  FiEdit,
  FiRepeat,
} from 'react-icons/fi';
// FiSearchReplace alias for FiRepeat
const FiSearchReplace = FiRepeat;

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

interface NotepadProps {
  initialPath?: string;
  initialFileName?: string;
  onClose?: () => void;
}

interface FileTab {
  id: string;
  filePath: string;
  fileName: string;
  content: string;
  isModified: boolean;
}

export function Notepad({ initialPath = 'C:\\Users\\User\\Documents', initialFileName = 'Untitled.txt', onClose }: NotepadProps) {
  const [tabs, setTabs] = useState<FileTab[]>([{
    id: 'tab-1',
    filePath: `${initialPath}\\${initialFileName}`,
    fileName: initialFileName,
    content: '',
    isModified: false,
  }]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [status, setStatus] = useState('Ready');
  const [lineNumbers, setLineNumbers] = useState('1');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [findResults, setFindResults] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [isWordWrap, setIsWordWrap] = useState(true);
  const { isOpen: isFindOpen, onOpen: onFindOpen, onClose: onFindClose } = useDisclosure();
  const { isOpen: isReplaceOpen, onOpen: onReplaceOpen, onClose: onReplaceClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toolbarBg = useColorModeValue('gray.50', 'gray.800');
  const statusBarBg = useColorModeValue('gray.100', 'gray.700');
  const tabBg = useColorModeValue('gray.50', 'gray.800');
  const activeTabBg = useColorModeValue('white', 'gray.700');

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeContent = activeTab?.content || '';

  // Update line numbers and cursor position
  const updateLineInfo = useCallback((content: string, cursorPos: number) => {
    const lines = content.substring(0, cursorPos).split('\n');
    const line = lines.length;
    const col = (lines[lines.length - 1] || '').length + 1;
    setCursorPosition({ line, col });

    const lineCount = content.split('\n').length;
    const numbers = Array.from({ length: lineCount }, (_, i) => (i + 1).toString()).join('\n');
    setLineNumbers(numbers);
  }, []);

  // Load file content
  const loadFile = async (path: string, tabId: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/fs/info?path=${encodeURIComponent(path)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.content !== undefined) {
          setTabs(prev => prev.map(tab => 
            tab.id === tabId 
              ? { ...tab, content: data.content, isModified: false }
              : tab
          ));
          setStatus('Loaded');
        }
      } else {
        setTabs(prev => prev.map(tab => 
          tab.id === tabId 
            ? { ...tab, content: '', isModified: false }
            : tab
        ));
        setStatus('New file');
      }
    } catch (error) {
      console.error('Error loading file:', error);
      setStatus('Error loading file');
    }
  };

  // Save file
  const saveFile = async () => {
    if (!activeTab) return;
    setStatus('Saving...');
    try {
      const response = await fetch(`${SERVER_URL}/api/fs/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: activeTab.filePath,
          content: activeContent,
        }),
      });

      if (response.ok) {
        setTabs(prev => prev.map(tab => 
          tab.id === activeTabId 
            ? { ...tab, isModified: false }
            : tab
        ));
        setStatus('Saved');
      } else {
        setStatus('Error saving file');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      setStatus('Error saving file');
    }
  };

  // Create new tab
  const createNewTab = () => {
    const newTab: FileTab = {
      id: `tab-${Date.now()}`,
      filePath: `${initialPath}\\Untitled.txt`,
      fileName: 'Untitled.txt',
      content: '',
      isModified: false,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setStatus('New file');
  };

  // Close tab
  const closeTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.isModified) {
      const shouldSave = window.confirm(`Do you want to save changes to ${tab.fileName}?`);
      if (shouldSave) {
        setActiveTabId(tabId);
        saveFile();
      }
    }

    const newTabs = tabs.filter(t => t.id !== tabId);
    if (newTabs.length === 0) {
      // Create a new empty tab if all are closed
      createNewTab();
    } else if (activeTabId === tabId && newTabs.length > 0) {
      const newActiveTab = newTabs[newTabs.length - 1];
      if (newActiveTab) {
        setActiveTabId(newActiveTab.id);
        loadFile(newActiveTab.filePath, newActiveTab.id);
      }
    }
    setTabs(newTabs);
  };

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, content: newContent, isModified: true }
        : tab
    ));
    setStatus('Modified');
    updateLineInfo(newContent, e.target.selectionStart);
  };

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveFile();
    }
    // Ctrl+N for new tab
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      createNewTab();
    }
    // Ctrl+F for find
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      onFindOpen();
    }
    // Ctrl+H for replace
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      onReplaceOpen();
    }
    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = activeContent.substring(0, start) + '\t' + activeContent.substring(end);
        setTabs(prev => prev.map(tab => 
          tab.id === activeTabId 
            ? { ...tab, content: newContent, isModified: true }
            : tab
        ));
        setStatus('Modified');
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    }
  };

  // Handle cursor movement
  const handleSelectChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateLineInfo(activeContent, e.target.selectionStart);
  };

  // Find text
  const findTextInContent = () => {
    if (!findText || !activeContent) return;
    
    const results: number[] = [];
    let index = activeContent.indexOf(findText);
    while (index !== -1) {
      results.push(index);
      index = activeContent.indexOf(findText, index + 1);
    }
    setFindResults(results);
    setCurrentMatchIndex(results.length > 0 ? 0 : -1);
    
    const firstMatch = results[0];
    if (firstMatch !== undefined && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(firstMatch, firstMatch + findText.length);
    }
  };

  // Replace text
  const replaceTextInContent = () => {
    if (!findText || !replaceText || currentMatchIndex < 0) return;
    
    const results = [...findResults];
    const matchPos = results[currentMatchIndex];
    if (matchPos === undefined) return;
    const newContent = activeContent.substring(0, matchPos) + replaceText + activeContent.substring(matchPos + findText.length);
    
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, content: newContent, isModified: true }
        : tab
    ));
    
    // Recalculate positions
    const diff = replaceText.length - findText.length;
    const newResults = results.map(pos => 
      pos < matchPos ? pos : pos + diff
    );
    setFindResults(newResults);
  };

  // Replace all
  const replaceAllText = () => {
    if (!findText || !replaceText) return;
    const newContent = activeContent.split(findText).join(replaceText);
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, content: newContent, isModified: true }
        : tab
    ));
    setFindResults([]);
    setCurrentMatchIndex(-1);
  };

  // Handle copy
  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
  };

  // Handle paste
  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, content: tab.content + text, isModified: true }
          : tab
      ));
    });
  };

  // Handle cut
  const handleCut = () => {
    navigator.clipboard.writeText(activeContent);
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, content: '', isModified: true }
        : tab
    ));
  };

  // New file
  const handleNewFile = () => {
    createNewTab();
  };

  // Open file (mock)
  const handleOpenFile = () => {
    alert('Open file dialog - coming soon!');
  };

  // Save as (mock)
  const handleSaveAs = () => {
    alert('Save As dialog - coming soon!');
  };

  return (
    <Flex direction="column" h="100%" bg={bgColor}>
      {/* Tab Bar */}
      <HStack
        px={1}
        py={1}
        bg={toolbarBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        spacing={0}
        overflowX="auto"
      >
        {tabs.map((tab) => (
          <HStack
            key={tab.id}
            px={3}
            py={1}
            bg={activeTabId === tab.id ? activeTabBg : tabBg}
            borderRadius="md"
            borderBottom={activeTabId === tab.id ? '2px solid' : 'none'}
            borderBottomColor={activeTabId === tab.id ? 'blue.500' : 'transparent'}
            cursor="pointer"
            onClick={() => setActiveTabId(tab.id)}
            _hover={{ bg: activeTabId === tab.id ? activeTabBg : useColorModeValue('gray.100', 'gray.700') }}
            transition="all 0.2s"
          >
            <Text fontSize="sm" noOfLines={1} maxW="150px">
              {tab.fileName}
            </Text>
            {tab.isModified && (
              <Text fontSize="xs" color="orange.500">•</Text>
            )}
            <IconButton
              aria-label="Close tab"
              icon={<FiX />}
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            />
          </HStack>
        ))}
        <Tooltip label="New Tab (Ctrl+N)">
          <IconButton
            aria-label="New tab"
            icon={<FiPlus />}
            size="sm"
            variant="ghost"
            onClick={createNewTab}
          />
        </Tooltip>
      </HStack>

      {/* Menu Bar */}
      <HStack
        px={2}
        py={1}
        borderBottom="1px solid"
        borderColor={borderColor}
        spacing={4}
      >
        <Menu>
          <MenuButton as={Button} size="sm" variant="ghost" fontSize="sm">
            File
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiFolderPlus />} onClick={handleNewFile}>
              New (Ctrl+N)
            </MenuItem>
            <MenuItem icon={<FiFolder />} onClick={handleOpenFile}>
              Open...
            </MenuItem>
            <MenuItem icon={<FiSave />} onClick={saveFile} isDisabled={!activeTab?.isModified && activeContent === ''}>
              Save (Ctrl+S)
            </MenuItem>
            <MenuItem icon={<FiSave />} onClick={handleSaveAs}>
              Save As...
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} size="sm" variant="ghost" fontSize="sm">
            Edit
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiRotateCw />}>Undo (Ctrl+Z)</MenuItem>
            <MenuItem icon={<FiRefreshCw />}>Redo (Ctrl+Y)</MenuItem>
            <MenuItem icon={<FiCopy />} onClick={handleCopy}>
              Copy (Ctrl+C)
            </MenuItem>
            <MenuItem icon={<FiScissors />} onClick={handleCut}>
              Cut (Ctrl+X)
            </MenuItem>
            <MenuItem icon={<FiFile />} onClick={handlePaste}>
              Paste (Ctrl+V)
            </MenuItem>
            <MenuItem icon={<FiSearch />} onClick={onFindOpen}>
              Find (Ctrl+F)
            </MenuItem>
            <MenuItem icon={<FiEdit />} onClick={onReplaceOpen}>
              Replace (Ctrl+H)
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} size="sm" variant="ghost" fontSize="sm">
            Format
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setIsWordWrap(!isWordWrap)}>
              Word Wrap {isWordWrap && '✓'}
            </MenuItem>
            <MenuItem>Font...</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} size="sm" variant="ghost" fontSize="sm">
            View
          </MenuButton>
          <MenuList>
            <MenuItem>Status Bar</MenuItem>
            <MenuItem>Line Numbers {lineNumbers !== '1' && '✓'}</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Toolbar */}
      <HStack
        px={2}
        py={1}
        bg={toolbarBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        spacing={1}
      >
        <Tooltip label="New File">
          <IconButton
            aria-label="New"
            icon={<FiFolderPlus />}
            size="sm"
            variant="ghost"
            onClick={handleNewFile}
          />
        </Tooltip>
        <Tooltip label="Open File">
          <IconButton
            aria-label="Open"
            icon={<FiFolder />}
            size="sm"
            variant="ghost"
            onClick={handleOpenFile}
          />
        </Tooltip>
        <Tooltip label="Save (Ctrl+S)">
          <IconButton
            aria-label="Save"
            icon={<FiSave />}
            size="sm"
            variant="ghost"
            onClick={saveFile}
            isDisabled={activeContent === ''}
          />
        </Tooltip>
        <Box w="1px" h="20px" bg={borderColor} mx={1} />
        <Tooltip label="Undo">
          <IconButton
            aria-label="Undo"
            icon={<FiRotateCw />}
            size="sm"
            variant="ghost"
          />
        </Tooltip>
        <Tooltip label="Redo">
          <IconButton
            aria-label="Redo"
            icon={<FiRefreshCw />}
            size="sm"
            variant="ghost"
          />
        </Tooltip>
        <Box w="1px" h="20px" bg={borderColor} mx={1} />
        <Tooltip label="Copy">
          <IconButton
            aria-label="Copy"
            icon={<FiCopy />}
            size="sm"
            variant="ghost"
            onClick={handleCopy}
          />
        </Tooltip>
        <Tooltip label="Cut">
          <IconButton
            aria-label="Cut"
            icon={<FiScissors />}
            size="sm"
            variant="ghost"
            onClick={handleCut}
          />
        </Tooltip>
        <Tooltip label="Paste">
          <IconButton
            aria-label="Paste"
            icon={<FiFile />}
            size="sm"
            variant="ghost"
            onClick={handlePaste}
          />
        </Tooltip>
        <Box w="1px" h="20px" bg={borderColor} mx={1} />
        <Tooltip label="Find (Ctrl+F)">
          <IconButton
            aria-label="Find"
            icon={<FiSearch />}
            size="sm"
            variant="ghost"
            onClick={onFindOpen}
          />
        </Tooltip>
        <Tooltip label="Replace (Ctrl+H)">
          <IconButton
            aria-label="Replace"
            icon={<FiSearchReplace />}
            size="sm"
            variant="ghost"
            onClick={onReplaceOpen}
          />
        </Tooltip>
      </HStack>

      {/* Text Area with Line Numbers */}
      <Flex flex={1} position="relative" overflow="hidden">
        {/* Line Numbers */}
        <Box
          w="50px"
          py={4}
          px={2}
          bg={toolbarBg}
          borderRight="1px solid"
          borderColor={borderColor}
          textAlign="right"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="14px"
          lineHeight="1.5"
          color={useColorModeValue('gray.500', 'gray.400')}
          userSelect="none"
          overflowY="hidden"
        >
          <Text
            whiteSpace="pre"
            lineHeight="1.5"
          >
            {lineNumbers}
          </Text>
        </Box>
        
        {/* Editor */}
        <Box flex={1} position="relative">
          <Textarea
            ref={textareaRef}
            value={activeContent}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelectChange}
            placeholder="Start typing..."
            size="sm"
            resize="none"
            border="none"
            borderRadius={0}
            h="100%"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="14px"
            lineHeight="1.5"
            p={4}
            pt={0}
            focusBorderColor="transparent"
            _focus={{ boxShadow: 'none' }}
            whiteSpace={isWordWrap ? 'pre-wrap' : 'pre'}
            overflowY="auto"
          />
        </Box>
      </Flex>

      {/* Status Bar */}
      <HStack
        px={3}
        py={1}
        bg={statusBarBg}
        borderTop="1px solid"
        borderColor={borderColor}
        fontSize="xs"
        spacing={4}
      >
        <Text>Ln {cursorPosition.line}, Col {cursorPosition.col}</Text>
        <Text>UTF-8</Text>
        <Text>{activeTab?.isModified ? 'Modified' : status}</Text>
        <Text flex={1} textAlign="right" noOfLines={1}>
          {activeTab?.filePath}
        </Text>
      </HStack>

      {/* Find Modal */}
      <Modal isOpen={isFindOpen} onClose={onFindClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Find..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && findTextInContent()}
            />
            {findResults.length > 0 && (
              <Text fontSize="sm" color="green.500" mt={2}>
                {findResults.length} match{findResults.length !== 1 ? 'es' : ''} found
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onFindClose}>
              Cancel
            </Button>
            <Button onClick={findTextInContent}>Find Next</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Replace Modal */}
      <Modal isOpen={isReplaceOpen} onClose={onReplaceClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Replace</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Input
                placeholder="Find..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
              />
              <Input
                placeholder="Replace with..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onReplaceClose}>
              Cancel
            </Button>
            <Button onClick={replaceTextInContent} mr={2}>Replace</Button>
            <Button onClick={replaceAllText}>Replace All</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Notepad;
