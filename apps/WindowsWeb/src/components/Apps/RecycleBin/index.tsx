'use client';

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Badge,
  Spinner,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
  FiTrash2,
  FiRotateCcw,
  FiMoreVertical,
  FiFolder,
  FiFile,
  FiAlertTriangle,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiMonitor,
} from 'react-icons/fi';
import { useRecycleBin, RecycleBinItem } from '@/contexts/RecycleBinContext';
import { apps } from '@/components/Apps/apps';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

// Custom event for desktop app restore
const RESTORE_DESKTOP_APP_EVENT = 'restoreDesktopApp';

export function RecycleBin() {
  const { items, removeItem, restoreItem, emptyBin, getDeletedItem } = useRecycleBin();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isEmptying, setIsEmptying] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const headerBg = useColorModeValue('gray.50', 'gray.900');

  // Separate desktop apps from file items
  const desktopApps = items.filter(item => item.type === 'desktopApp');
  const fileItems = items.filter(item => item.type === 'file' || item.type === 'directory');

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get folder path from original path
  const getFolderPath = (path: string): string => {
    const parts = path.split('\\');
    if (parts.length > 1) {
      return parts.slice(0, -1).join('\\');
    }
    return path;
  };

  // Check if a file with the same name already exists at the restore location
  const checkFileExists = async (path: string): Promise<boolean> => {
    try {
      const response = await fetch(`${SERVER_URL}/api/fs/info?path=${encodeURIComponent(path)}`);
      return response.ok;
    } catch {
      return false;
    }
  };

  // Restore a desktop app
  const handleRestoreDesktopApp = useCallback((item: RecycleBinItem) => {
    if (!item.appData) return;

    // Dispatch custom event to notify page.tsx to restore the app
    const event = new CustomEvent(RESTORE_DESKTOP_APP_EVENT, {
      detail: {
        processName: item.appData.processName,
        originalPosition: item.appData.originalPosition,
        itemId: item.id,
      },
    });
    window.dispatchEvent(event);

    // Remove from recycle bin
    restoreItem(item.id);

    toast({
      title: 'App restored',
      description: `${item.name} has been restored to the desktop`,
      status: 'success',
      duration: 3000,
    });
  }, [restoreItem, toast]);

  // Restore a single file with its original content
  const handleRestore = async (item: RecycleBinItem) => {
    // Handle desktop apps differently
    if (item.type === 'desktopApp') {
      handleRestoreDesktopApp(item);
      return;
    }

    setIsRestoring(true);
    let success = false;
    
    try {
      // Check if file already exists at original location
      const exists = await checkFileExists(item.originalPath);
      if (exists) {
        toast({
          title: 'File already exists',
          description: `A file named "${item.name}" already exists at ${getFolderPath(item.originalPath)}. Please rename or delete the existing file first.`,
          status: 'warning',
          duration: 5000,
        });
        setIsRestoring(false);
        return;
      }

      if (item.type === 'directory') {
        // Create directory at original location
        const response = await fetch(`${SERVER_URL}/api/fs/directory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: item.originalPath }),
        });
        if (!response.ok) {
          throw new Error('Failed to restore directory');
        }
        success = true;
      } else {
        // Restore file with stored content
        const content = item.content || `[Restored from Recycle Bin]\nOriginal path: ${item.originalPath}\nDeleted: ${item.deletedAt}`;
        
        const response = await fetch(`${SERVER_URL}/api/fs/write`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            path: item.originalPath, 
            content: content
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to restore file');
        }
        success = true;
      }
      
      if (success) {
        restoreItem(item.id);
        toast({
          title: 'Item restored',
          description: `${item.name} has been restored to ${getFolderPath(item.originalPath)}`,
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error restoring item:', error);
      toast({
        title: 'Restore failed',
        description: `Could not restore ${item.name}`,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsRestoring(false);
    }
  };

  // Permanently delete a single item
  const handleDelete = (item: RecycleBinItem) => {
    removeItem(item.id);
    setSelectedItem(null);
    toast({
      title: 'Item permanently deleted',
      description: `${item.name} has been permanently deleted`,
      status: 'info',
      duration: 3000,
    });
  };

  // Empty the recycle bin
  const handleEmptyBin = async () => {
    setIsEmptying(true);
    try {
      // Clean up any localStorage entries for deleted items
      items.forEach(item => {
        const contentKey = `fileContent_${item.originalPath.replace(/\\/g, '_')}`;
        localStorage.removeItem(contentKey);
      });
      
      emptyBin();
      onClose();
      toast({
        title: 'Recycle Bin emptied',
        description: 'All items have been permanently deleted',
        status: 'info',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error emptying recycle bin:', error);
      toast({
        title: 'Error',
        description: 'Failed to empty Recycle Bin',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsEmptying(false);
    }
  };

  // Restore all items
  const handleRestoreAll = async () => {
    setIsRestoring(true);
    let restoredCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    
    const itemsToRestore = [...items];
    
    for (const item of itemsToRestore) {
      try {
        // Handle desktop apps
        if (item.type === 'desktopApp') {
          handleRestoreDesktopApp(item);
          restoredCount++;
          continue;
        }

        // Check if file already exists at original location
        const exists = await checkFileExists(item.originalPath);
        if (exists) {
          skippedCount++;
          continue;
        }

        if (item.type === 'directory') {
          await fetch(`${SERVER_URL}/api/fs/directory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: item.originalPath }),
          });
        } else {
          // Restore file with stored content
          const content = item.content || `[Restored from Recycle Bin]\nOriginal path: ${item.originalPath}\nDeleted: ${item.deletedAt}`;
          
          await fetch(`${SERVER_URL}/api/fs/write`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              path: item.originalPath, 
              content: content
            }),
          });
        }
        restoreItem(item.id);
        restoredCount++;
      } catch (error) {
        console.error('Error restoring item:', error);
        failedCount++;
      }
    }
    
    setIsRestoring(false);
    
    let description = '';
    if (restoredCount > 0) {
      description = `${restoredCount} item(s) restored`;
      if (skippedCount > 0) {
        description += `, ${skippedCount} skipped (already exist)`;
      }
      if (failedCount > 0) {
        description += `, ${failedCount} failed`;
      }
    } else if (skippedCount > 0) {
      description = 'All items already exist at their original locations';
    } else {
      description = 'Could not restore any items';
    }
    
    toast({
      title: restoredCount > 0 ? 'Restore complete' : (skippedCount > 0 ? 'Items skipped' : 'Restore failed'),
      description,
      status: restoredCount > 0 ? 'success' : (skippedCount > 0 ? 'warning' : 'error'),
      duration: 4000,
    });
  };

  // Toggle select all items
  const handleSelectAll = () => {
    if (selectedItem === 'all') {
      setSelectedItem(null);
    } else {
      setSelectedItem('all');
    }
  };

  const isSelected = (id: string): boolean => selectedItem === id || selectedItem === 'all';

  // Get app icon for desktop apps
  const getAppIcon = (processName: string) => {
    const app = apps[processName as keyof typeof apps];
    if (app && app.icon) {
      return app.icon;
    }
    return <FiMonitor />;
  };

  return (
    <Flex direction="column" h="100%" bg={bgColor}>
      {/* Toolbar */}
      <Flex
        align="center"
        p={2}
        borderBottom="1px solid"
        borderColor={borderColor}
        gap={2}
      >
        <Tooltip label="Restore all items">
          <Button
            leftIcon={isRestoring ? <Spinner size="sm" /> : <FiRotateCcw />}
            size="sm"
            variant="ghost"
            onClick={handleRestoreAll}
            isDisabled={items.length === 0 || isRestoring || isEmptying}
          >
            {isRestoring ? 'Restoring...' : 'Restore all'}
          </Button>
        </Tooltip>
        
        <Tooltip label="Empty Recycle Bin">
          <Button
            leftIcon={isEmptying ? <Spinner size="sm" colorScheme="red" /> : <FiTrash2 />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={onOpen}
            isDisabled={items.length === 0 || isRestoring || isEmptying}
          >
            {isEmptying ? 'Emptying...' : 'Empty Recycle Bin'}
          </Button>
        </Tooltip>

        <Box ml="auto">
          <Tooltip label="Refresh">
            <IconButton
              aria-label="Refresh"
              icon={<FiRefreshCw />}
              size="sm"
              variant="ghost"
              onClick={() => window.location.reload()}
            />
          </Tooltip>
        </Box>
      </Flex>

      {/* Header info */}
      {items.length > 0 && (
        <Flex
          align="center"
          px={4}
          py={2}
          bg={headerBg}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <HStack spacing={4}>
            <Text fontSize="sm" color="gray.600">
              {items.length} item{items.length !== 1 ? 's' : ''} in Recycle Bin
            </Text>
            {desktopApps.length > 0 && (
              <Badge colorScheme="purple" fontSize="xs">
                {desktopApps.length} app{desktopApps.length !== 1 ? 's' : ''}
              </Badge>
            )}
            <Badge colorScheme="blue" fontSize="xs">
              {fileItems.filter(i => i.type === 'file').length} files
            </Badge>
            <Badge colorScheme="orange" fontSize="xs">
              {fileItems.filter(i => i.type === 'directory').length} folders
            </Badge>
          </HStack>
        </Flex>
      )}

      {/* Content */}
      <Box flex={1} overflowY="auto" p={2}>
        {items.length === 0 ? (
          <Flex justify="center" align="center" h="100%" color="gray.500">
            <VStack spacing={4}>
              <FiTrash2 size={64} />
              <Text fontSize="lg" fontWeight="semibold">
                Recycle Bin is empty
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center" maxW="300px">
                Items you delete will appear here. Deleted files and apps can be restored.
              </Text>
            </VStack>
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            {/* Desktop Apps Section */}
            {desktopApps.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2} px={2}>
                  Desktop Apps
                </Text>
                <SimpleGrid columns={[2, 3, 4, 5]} spacing={4} px={2}>
                  {desktopApps.map((item) => (
                    <Box
                      key={item.id}
                      p={3}
                      border="1px solid"
                      borderColor={isSelected(item.id) ? 'blue.400' : borderColor}
                      bg={isSelected(item.id) ? selectedBg : 'transparent'}
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: hoverBg, borderColor: 'blue.300' }}
                      onClick={() => setSelectedItem(isSelected(item.id) ? null : item.id)}
                      position="relative"
                    >
                      <VStack spacing={2} align="center">
                        <Box fontSize="32px" color="purple.500">
                          {item.appData?.processName && getAppIcon(item.appData.processName)}
                        </Box>
                        <Text fontSize="xs" textAlign="center" noOfLines={2}>
                          {item.name}
                        </Text>
                        <Text fontSize="10px" color="gray.500">
                          {formatDate(item.deletedAt)}
                        </Text>
                        <Button
                          size="xs"
                          colorScheme="blue"
                          leftIcon={<FiRotateCcw size={12} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestoreDesktopApp(item);
                          }}
                          isDisabled={isRestoring || isEmptying}
                          width="100%"
                        >
                          Restore
                        </Button>
                      </VStack>
                      
                      {/* Delete button */}
                      <IconButton
                        aria-label="Delete permanently"
                        icon={<FiTrash2 />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        position="absolute"
                        top={1}
                        right={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item);
                        }}
                        isDisabled={isRestoring || isEmptying}
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {/* Files and Folders Section */}
            {fileItems.length > 0 && (
              <Box>
                {desktopApps.length > 0 && (
                  <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2} px={2}>
                    Files and Folders
                  </Text>
                )}
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th w="40px">
                        <input 
                          type="checkbox" 
                          checked={selectedItem === 'all'}
                          onChange={handleSelectAll}
                        />
                      </Th>
                      <Th>Name</Th>
                      <Th>Original location</Th>
                      <Th>Date deleted</Th>
                      <Th isNumeric>Size</Th>
                      <Th>Type</Th>
                      <Th w="40px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {fileItems.map((item) => (
                      <Tr
                        key={item.id}
                        cursor="pointer"
                        bg={isSelected(item.id) ? selectedBg : 'transparent'}
                        _hover={{ bg: hoverBg }}
                        onClick={() => setSelectedItem(isSelected(item.id) ? null : item.id)}
                      >
                        <Td onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={isSelected(item.id)}
                            onChange={() => setSelectedItem(isSelected(item.id) ? null : item.id)}
                          />
                        </Td>
                        <Td>
                          <HStack>
                            {item.type === 'directory' ? (
                              <FiFolder color="#FFD700" />
                            ) : (
                              <FiFile color="#4A90E2" />
                            )}
                            <Text fontWeight={item.type === 'directory' ? 'semibold' : 'normal'}>
                              {item.name}
                            </Text>
                            {item.content && item.type === 'file' && (
                              <Tooltip label="Content preserved">
                                <Badge colorScheme="green" fontSize="xs">✓</Badge>
                              </Tooltip>
                            )}
                          </HStack>
                        </Td>
                        <Td fontSize="xs" color="gray.600" maxW="200px" isTruncated>
                          <Tooltip label={getFolderPath(item.originalPath)}>
                            <Text>{getFolderPath(item.originalPath)}</Text>
                          </Tooltip>
                        </Td>
                        <Td fontSize="xs" color="gray.600">
                          {formatDate(item.deletedAt)}
                        </Td>
                        <Td fontSize="xs" isNumeric>
                          {item.type === 'file' ? formatSize(item.size) : '-'}
                        </Td>
                        <Td fontSize="xs">
                          {item.type === 'directory' ? 'File folder' : 'File'}
                        </Td>
                        <Td onClick={(e) => e.stopPropagation()}>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FiMoreVertical />}
                              size="xs"
                              variant="ghost"
                            />
                            <MenuList>
                              <MenuItem 
                                icon={isRestoring ? <Spinner size="sm" /> : <FiRotateCcw />} 
                                onClick={() => handleRestore(item)}
                                isDisabled={isRestoring || isEmptying}
                              >
                                Restore
                              </MenuItem>
                              <MenuItem 
                                icon={<FiTrash2 />} 
                                color="red.500"
                                onClick={() => handleDelete(item)}
                                isDisabled={isRestoring || isEmptying}
                              >
                                Delete permanently
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </VStack>
        )}
      </Box>

      {/* Status bar */}
      <Flex
        align="center"
        justify="space-between"
        p={2}
        borderTop="1px solid"
        borderColor={borderColor}
        fontSize="xs"
        color="gray.500"
      >
        <HStack spacing={4}>
          <Text>{items.length} items</Text>
          <Text>|</Text>
          <Text>{formatSize(items.reduce((acc, item) => acc + item.size, 0))}</Text>
        </HStack>
        <HStack spacing={4}>
          {desktopApps.length > 0 && (
            <Text>{desktopApps.length} apps</Text>
          )}
          <Text>{fileItems.filter(i => i.type === 'file').length} files</Text>
          <Text>{fileItems.filter(i => i.type === 'directory').length} folders</Text>
        </HStack>
      </Flex>

      {/* Empty confirmation dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack>
                <FiAlertTriangle color="orange" />
                <Text>Empty Recycle Bin?</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to permanently delete all {items.length} item{items.length !== 1 ? 's' : ''} in the Recycle Bin?
              <Text mt={2} fontSize="sm" color="gray.500">
                This action cannot be undone.
              </Text>
              {items.length > 0 && (
                <Box mt={2} p={2} bg="red.50" borderRadius="md">
                  <Text fontSize="sm" color="red.600">
                    {desktopApps.length > 0 && `${desktopApps.length} app(s), `}
                    {fileItems.filter(i => i.type === 'file').length} files and {fileItems.filter(i => i.type === 'directory').length} folders will be permanently deleted.
                  </Text>
                </Box>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} leftIcon={<FiX />}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleEmptyBin} ml={3} leftIcon={<FiTrash2 />} isLoading={isEmptying}>
                Empty Recycle Bin
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
