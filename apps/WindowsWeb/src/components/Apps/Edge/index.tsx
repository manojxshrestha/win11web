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
} from 'react-icons/fi';
import { BrowserTab } from './BrowserTab';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  history: string[];
  historyIndex: number;
}

export function Edge() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      title: 'New Tab',
      url: 'https://www.bing.com/',
      history: ['https://www.bing.com/'],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [inputUrl, setInputUrl] = useState('https://www.bing.com/');
  const [bookmarks, setBookmarks] = useState<string[]>([
    'https://www.bing.com/',
    'https://www.github.com/',
    'https://www.wikipedia.org/',
  ]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const toolbarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.300', 'gray.700');

  const createNewTab = () => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      url: 'https://www.bing.com/',
      history: ['https://www.bing.com/'],
      historyIndex: 0,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setInputUrl(newTab.url);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return; // Keep at least one tab

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

  // Get the server URL from environment or use default
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

  const getProxyUrl = (targetUrl: string) => {
    return `${SERVER_URL}/api/proxy?url=${encodeURIComponent(targetUrl)}`;
  };

  const navigate = (url: string) => {
    if (!activeTab) return;

    let fullUrl = url;
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it's a search query or URL
      if (url.includes('.') && !url.includes(' ')) {
        fullUrl = `https://${url}`;
      } else {
        // Treat as search query
        fullUrl = `https://www.bing.com/search?q=${encodeURIComponent(url)}`;
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
    navigate('https://www.bing.com/');
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
      {/* Tab Bar */}
      <HStack
        w="100%"
        px={2}
        py={1}
        bg={toolbarBg}
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

      {/* Navigation Bar */}
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
            />
          </Tooltip>
        </HStack>

        {/* Address Bar */}
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
            placeholder="Search or enter web address"
            borderRadius="full"
            bg={useColorModeValue('gray.100', 'gray.700')}
            _focus={{
              bg: useColorModeValue('white', 'gray.600'),
              borderColor: 'blue.400',
            }}
          />
          <InputRightElement>
            <Tooltip label="Add to bookmarks">
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

        {/* More Options */}
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
            <MenuItem>Settings</MenuItem>
            <MenuItem>History</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Content Area */}
      <Box flex={1} w="100%" position="relative" overflow="hidden">
        {activeTab && (
          <chakra.iframe
            ref={iframeRef}
            key={activeTab.id}
            src={getProxyUrl(activeTab.url)}
            title={activeTab.title}
            width="100%"
            height="100%"
            border="none"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-modals"
          />
        )}
      </Box>
    </VStack>
  );
}
