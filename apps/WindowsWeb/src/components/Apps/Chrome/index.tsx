'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  Tooltip,
  chakra,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import {
  FiArrowLeft,
  FiArrowRight,
  FiRefreshCw,
  FiHome,
  FiStar,
  FiMoreVertical,
  FiPlus,
  FiLock,
  FiGlobe,
  FiDownload,
  FiSettings,
} from 'react-icons/fi';
import { BrowserTab } from '../Edge/BrowserTab';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  history: string[];
  historyIndex: number;
}

export function Chrome() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      title: 'New Tab',
      url: 'https://www.google.com/',
      history: ['https://www.google.com/'],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [inputUrl, setInputUrl] = useState('https://www.google.com/');
  const [bookmarks, setBookmarks] = useState<string[]>([
    'https://www.google.com/',
    'https://www.github.com/',
    'https://www.stackoverflow.com/',
  ]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const bgColor = useColorModeValue('white', 'gray.900');
  const toolbarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const createNewTab = () => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      url: 'https://www.google.com/',
      history: ['https://www.google.com/'],
      historyIndex: 0,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setInputUrl(newTab.url);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;

    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const newActiveTab = newTabs[Math.min(tabIndex, newTabs.length - 1)];
      if (newActiveTab) {
        setActiveTabId(newActiveTab.id);
        setInputUrl(newActiveTab.url);
      }
    }
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      setInputUrl(tab.url);
    }
  };

  const navigate = (url: string) => {
    if (!activeTab) return;

    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        fullUrl = `https://${url}`;
      } else {
        fullUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    const updatedTabs = tabs.map((tab) => {
      if (tab.id === activeTabId) {
        const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), fullUrl];
        return {
          ...tab,
          url: fullUrl,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          title: new URL(fullUrl).hostname,
        };
      }
      return tab;
    });

    setTabs(updatedTabs);
    setInputUrl(fullUrl);
  };

  const goBack = () => {
    if (!activeTab || activeTab.historyIndex === 0) return;

    const updatedTabs = tabs.map((tab) => {
      if (tab.id === activeTabId) {
        const newIndex = tab.historyIndex - 1;
        return {
          ...tab,
          url: tab.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return tab;
    });

    setTabs(updatedTabs as Tab[]);
    if (activeTab) {
      const prevUrl = activeTab.history[activeTab.historyIndex - 1];
      if (prevUrl) setInputUrl(prevUrl);
    }
  };

  const goForward = () => {
    if (!activeTab || activeTab.historyIndex >= activeTab.history.length - 1) return;

    const updatedTabs = tabs.map((tab) => {
      if (tab.id === activeTabId) {
        const newIndex = tab.historyIndex + 1;
        return {
          ...tab,
          url: tab.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return tab;
    });

    setTabs(updatedTabs as Tab[]);
    if (activeTab) {
      const nextUrl = activeTab.history[activeTab.historyIndex + 1];
      if (nextUrl) setInputUrl(nextUrl);
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = activeTab?.url || '';
    }
  };

  const goHome = () => {
    navigate('https://www.google.com/');
  };

  const addBookmark = () => {
    if (activeTab && !bookmarks.includes(activeTab.url)) {
      setBookmarks([...bookmarks, activeTab.url]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(inputUrl);
    }
  };

  const canGoBack = activeTab && activeTab.historyIndex > 0;
  const canGoForward = activeTab && activeTab.historyIndex < activeTab.history.length - 1;

  return (
    <VStack h="100%" w="100%" spacing={0} bg={bgColor}>
      {/* Tab Bar with Material You styling */}
      <HStack
        w="100%"
        px={2}
        py={1}
        bg={useColorModeValue('gray.100', 'gray.800')}
        spacing={0}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        {tabs.map((tab) => (
          <BrowserTab
            key={tab.id}
            id={tab.id}
            title={tab.title}
            url={tab.url}
            favicon={tab.favicon}
            isActive={activeTabId === tab.id}
            onClose={() => closeTab(tab.id)}
            onClick={() => switchTab(tab.id)}
          />
        ))}
        <IconButton
          aria-label="New tab"
          icon={<FiPlus />}
          size="sm"
          variant="ghost"
          onClick={createNewTab}
          borderRadius="full"
        />
      </HStack>

      {/* Navigation Bar with Material Design */}
      <HStack
        w="100%"
        px={3}
        py={2}
        bg={toolbarBg}
        spacing={2}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <HStack spacing={1}>
          <Tooltip label="Back">
            <IconButton
              aria-label="Back"
              icon={<FiArrowLeft />}
              size="sm"
              variant="ghost"
              isDisabled={!canGoBack}
              onClick={goBack}
              borderRadius="full"
              colorScheme="gray"
            />
          </Tooltip>
          <Tooltip label="Forward">
            <IconButton
              aria-label="Forward"
              icon={<FiArrowRight />}
              size="sm"
              variant="ghost"
              isDisabled={!canGoForward}
              onClick={goForward}
              borderRadius="full"
              colorScheme="gray"
            />
          </Tooltip>
          <Tooltip label="Refresh">
            <IconButton
              aria-label="Refresh"
              icon={<FiRefreshCw />}
              size="sm"
              variant="ghost"
              onClick={refresh}
              borderRadius="full"
              colorScheme="gray"
            />
          </Tooltip>
          <Tooltip label="Home">
            <IconButton
              aria-label="Home"
              icon={<FiHome />}
              size="sm"
              variant="ghost"
              onClick={goHome}
              borderRadius="full"
              colorScheme="gray"
            />
          </Tooltip>
        </HStack>

        {/* Address Bar with Material Design */}
        <InputGroup flex={1} size="md">
          <InputLeftElement pointerEvents="none">
            {activeTab?.url.startsWith('https://') ? (
              <FiLock color="green" />
            ) : (
              <FiGlobe color="gray" />
            )}
          </InputLeftElement>
          <Input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search Google or type a URL"
            borderRadius="full"
            bg={useColorModeValue('gray.100', 'gray.700')}
            border="none"
            _focus={{
              bg: useColorModeValue('white', 'gray.600'),
              boxShadow: 'md',
            }}
          />
          <InputRightElement>
            <Tooltip label="Bookmark this page">
              <IconButton
                aria-label="Bookmark"
                icon={<FiStar />}
                size="xs"
                variant="ghost"
                onClick={addBookmark}
                borderRadius="full"
              />
            </Tooltip>
          </InputRightElement>
        </InputGroup>

        {/* Extensions Badge (Mock) */}
        <HStack spacing={2}>
          <Tooltip label="Extensions">
            <Badge
              colorScheme="blue"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
              cursor="pointer"
            >
              3 Extensions
            </Badge>
          </Tooltip>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="More options"
              icon={<FiMoreVertical />}
              size="sm"
              variant="ghost"
              borderRadius="full"
            />
            <MenuList>
              <MenuItem icon={<FiStar />}>Bookmarks</MenuItem>
              <MenuItem icon={<FiDownload />}>Downloads</MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem>History</MenuItem>
              <MenuItem>Extensions</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>

      {/* Content Area */}
      <Box flex={1} w="100%" position="relative" overflow="hidden">
        {activeTab && (
          <chakra.iframe
            ref={iframeRef}
            key={activeTab.id}
            src={activeTab.url}
            title={activeTab.title}
            width="100%"
            height="100%"
            border="none"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </Box>
    </VStack>
  );
}
