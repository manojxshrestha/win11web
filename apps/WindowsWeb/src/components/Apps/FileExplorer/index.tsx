'use client';

import {
  Flex,
  HStack,
  VStack,
  Box,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRecycleBin, RecycleBinItem } from '@/contexts/RecycleBinContext';
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUp,
  FiRefreshCw,
  FiFolder,
  FiFile,
  FiMoreVertical,
  FiHome,
  FiDownload,
  FiHardDrive,
  FiUpload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiScissors,
  FiClipboard,
  FiFileText,
  FiImage,
  FiMusic,
  FiVideo,
  FiArchive,
  FiCode,
} from 'react-icons/fi';
import {
  FaFileExcel,
  FaFileWord,
  FaFilePowerpoint,
  FaFilePdf,
} from 'react-icons/fa';

interface FileSystemItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  modified: string;
  content?: string;
}

type FileOperation = 'copy' | 'cut' | null;

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

export function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('C:\\Users\\User\\Desktop');
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['C:\\Users\\User\\Desktop']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [clipboardOperation, setClipboardOperation] = useState<FileOperation>(null);
  const [clipboardPath, setClipboardPath] = useState<string | null>(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ path: string; name: string } | null>(null);
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { addItem, addItemWithContent, items: recycleBinItems } = useRecycleBin();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const dropZoneBg = useColorModeValue('blue.50', 'blue.900');

  // Load directory contents
  const loadDirectory = async (path: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/fs/list?path=${encodeURIComponent(path)}`);
      
      if (!response.ok) {
        throw new Error('Failed to load directory');
      }

      const data = await response.json();
      setItems(data.files || []);
      setCurrentPath(path);
    } catch (error) {
      console.error('Error loading directory:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDirectory(currentPath);
  }, []);

  // Navigate to path
  const navigateTo = (path: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    loadDirectory(path);
    setSelectedItem(null);
  };

  // Go back in history
  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const targetPath = history[newIndex];
      if (targetPath) loadDirectory(targetPath);
      setSelectedItem(null);
    }
  };

  // Go forward in history
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const targetPath = history[newIndex];
      if (targetPath) loadDirectory(targetPath);
      setSelectedItem(null);
    }
  };

  // Go up one directory
  const goUp = () => {
    const parts = currentPath.split('\\');
    if (parts.length > 1) {
      parts.pop();
      const parentPath = parts.join('\\') || 'C:';
      navigateTo(parentPath);
    }
  };

  // Refresh current directory
  const refresh = () => {
    loadDirectory(currentPath);
  };

  // Upload file
  const uploadFile = async (file: File) => {
    try {
      const content = await file.text();
      const fileName = file.name;
      const filePath = `${currentPath}\\${fileName}`;
      
      const response = await fetch(`${SERVER_URL}/api/fs/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, content }),
      });

      if (response.ok) {
        toast({
          title: 'File uploaded',
          description: `${fileName} has been uploaded to ${currentPath}`,
          status: 'success',
          duration: 3000,
        });
        refresh();
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload the file',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]!);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]!);
    }
  }, [currentPath]);

  // Delete item (send to Recycle Bin)
  const deleteItem = async (item: FileSystemItem) => {
    try {
      // Check if item is already in recycle bin
      const existingItem = recycleBinItems.find(rbItem => rbItem.originalPath === item.path);
      if (existingItem) {
        toast({
          title: 'Item already in Recycle Bin',
          description: `${item.name} is already in the Recycle Bin`,
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      if (item.type === 'file') {
        // Get file content and add to recycle bin with content
        try {
          const infoResponse = await fetch(`${SERVER_URL}/api/fs/info?path=${encodeURIComponent(item.path)}`);
          if (infoResponse.ok) {
            const infoData = await infoResponse.json();
            addItemWithContent({
              name: item.name,
              originalPath: item.path,
              size: item.size,
              type: 'file',
            }, infoData.content || '');
          } else {
            addItem({
              name: item.name,
              originalPath: item.path,
              size: item.size,
              type: 'file',
            });
          }
        } catch (e) {
          console.warn('Could not store file content:', e);
          addItem({
            name: item.name,
            originalPath: item.path,
            size: item.size,
            type: 'file',
          });
        }
      } else {
        // For directories, just add without content
        addItem({
          name: item.name,
          originalPath: item.path,
          size: item.size,
          type: 'directory',
        });
      }

      const deleteResponse = await fetch(`${SERVER_URL}/api/fs/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: item.path, recursive: true }),
      });

      if (deleteResponse.ok) {
        toast({
          title: 'Item deleted',
          description: `${item.name} has been moved to Recycle Bin`,
          status: 'success',
          duration: 3000,
        });
        refresh();
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Delete failed',
        description: 'Could not delete the item',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Create folder
  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const folderPath = `${currentPath}\\${newFolderName.trim()}`;
      const response = await fetch(`${SERVER_URL}/api/fs/directory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: folderPath }),
      });

      if (response.ok) {
        toast({
          title: 'Folder created',
          description: `${newFolderName} has been created`,
          status: 'success',
          duration: 3000,
        });
        setIsCreateFolderOpen(false);
        setNewFolderName('');
        refresh();
      } else {
        throw new Error('Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Create failed',
        description: 'Could not create the folder',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Rename item
  const renameItem = async () => {
    if (!renameTarget || !newName.trim()) return;
    
    try {
      const response = await fetch(`${SERVER_URL}/api/fs/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: renameTarget.path, newName: newName.trim() }),
      });

      if (response.ok) {
        toast({
          title: 'Item renamed',
          description: `${renameTarget.name} has been renamed to ${newName}`,
          status: 'success',
          duration: 3000,
        });
        setIsRenameOpen(false);
        setRenameTarget(null);
        setNewName('');
        refresh();
      } else {
        throw new Error('Failed to rename');
      }
    } catch (error) {
      console.error('Error renaming:', error);
      toast({
        title: 'Rename failed',
        description: 'Could not rename the item',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Copy item
  const copyItem = (item: FileSystemItem) => {
    setClipboardOperation('copy');
    setClipboardPath(item.path);
    toast({
      title: 'Copied',
      description: `${item.name} has been copied`,
      status: 'info',
      duration: 2000,
    });
  };

  // Cut item
  const cutItem = (item: FileSystemItem) => {
    setClipboardOperation('cut');
    setClipboardPath(item.path);
    toast({
      title: 'Cut',
      description: `${item.name} has been cut`,
      status: 'info',
      duration: 2000,
    });
  };

  // Paste item
  const pasteItem = async () => {
    if (!clipboardPath || !clipboardOperation) return;
    
    try {
      const response = await fetch(`${SERVER_URL}/api/fs/${clipboardOperation === 'copy' ? 'copy' : 'move'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sourcePath: clipboardPath, 
          destPath: currentPath 
        }),
      });

      if (response.ok) {
        toast({
          title: clipboardOperation === 'copy' ? 'Copied' : 'Moved',
          description: `Item has been ${clipboardOperation === 'copy' ? 'copied' : 'moved'} to ${currentPath}`,
          status: 'success',
          duration: 3000,
        });
        setClipboardOperation(null);
        setClipboardPath(null);
        refresh();
      } else {
        throw new Error('Failed to paste');
      }
    } catch (error) {
      console.error('Error pasting:', error);
      toast({
        title: 'Paste failed',
        description: 'Could not paste the item',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Handle item double click
  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'directory') {
      navigateTo(item.path);
    } else {
      viewFile(item.path);
    }
  };

  // View file content
  const viewFile = async (path: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/fs/info?path=${encodeURIComponent(path)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          alert(`File: ${path}\n\n${data.content}`);
        }
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

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

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    const parts = currentPath.split('\\').filter(p => p);
    const breadcrumbs: { label: string; path: string }[] = [];
    
    let path = '';
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part) {
        path += (path ? '\\' : '') + part;
        breadcrumbs.push({ label: part, path });
      }
    }
    
    return breadcrumbs;
  };

  // Get file icon based on type
  const getFileIcon = (item: FileSystemItem) => {
    if (item.type === 'directory') {
      return <FiFolder size={20} color="#FFD700" />;
    }

    const ext = item.name.split('.').pop()?.toLowerCase() || '';
    
    switch (ext) {
      case 'txt':
      case 'md':
      case 'log':
        return <FiFileText size={20} color="#4A90D9" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'webp':
        return <FiImage size={20} color="#E91E63" />;
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'm4a':
        return <FiMusic size={20} color="#9C27B0" />;
      case 'mp4':
      case 'avi':
      case 'mkv':
      case 'mov':
        return <FiVideo size={20} color="#FF5722" />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <FiArchive size={20} color="#795548" />;
      case 'js':
      case 'ts':
      case 'py':
      case 'java':
      case 'c':
      case 'cpp':
      case 'html':
      case 'css':
      case 'json':
      case 'xml':
        return <FiCode size={20} color="#FF9800" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FaFileExcel size={20} color="#217346" />;
      case 'docx':
      case 'doc':
        return <FaFileWord size={20} color="#2B579A" />;
      case 'pptx':
      case 'ppt':
        return <FaFilePowerpoint size={20} color="#D24726" />;
      case 'pdf':
        return <FaFilePdf size={20} color="#F44336" />;
      default:
        return <FiFile size={20} color="#757575" />;
    }
  };

  // Get file type label
  const getFileTypeLabel = (item: FileSystemItem): string => {
    if (item.type === 'directory') return 'File folder';
    
    const ext = item.name.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
      txt: 'Text Document',
      md: 'Markdown File',
      pdf: 'PDF Document',
      docx: 'Word Document',
      doc: 'Word Document',
      xlsx: 'Excel Workbook',
      xls: 'Excel Workbook',
      pptx: 'PowerPoint Presentation',
      ppt: 'PowerPoint Presentation',
      png: 'PNG Image',
      jpg: 'JPEG Image',
      jpeg: 'JPEG Image',
      gif: 'GIF Image',
      mp4: 'MP4 Video',
      mp3: 'MP3 Audio',
      zip: 'Compressed Archive',
      rar: 'Compressed Archive',
      js: 'JavaScript File',
      ts: 'TypeScript File',
      py: 'Python File',
      html: 'HTML File',
      css: 'CSS File',
      json: 'JSON File',
      exe: 'Application',
      msi: 'Application',
    };
    
    return typeMap[ext] || `${ext.toUpperCase()} File`;
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
        <HStack spacing={1}>
          <Tooltip label="Go back">
            <IconButton
              aria-label="Back"
              icon={<FiArrowLeft />}
              size="sm"
              isDisabled={historyIndex === 0}
              onClick={goBack}
              variant="ghost"
            />
          </Tooltip>
          <Tooltip label="Go forward">
            <IconButton
              aria-label="Forward"
              icon={<FiArrowRight />}
              size="sm"
              isDisabled={historyIndex === history.length - 1}
              onClick={goForward}
              variant="ghost"
            />
          </Tooltip>
          <Tooltip label="Go up">
            <IconButton
              aria-label="Up"
              icon={<FiArrowUp />}
              size="sm"
              isDisabled={currentPath === 'C:' || currentPath.split('\\').length <= 1}
              onClick={goUp}
              variant="ghost"
            />
          </Tooltip>
          <Tooltip label="Refresh">
            <IconButton
              aria-label="Refresh"
              icon={<FiRefreshCw />}
              size="sm"
              onClick={refresh}
              variant="ghost"
            />
          </Tooltip>
        </HStack>

        <HStack spacing={1} ml={2}>
          <Tooltip label="Home">
            <IconButton
              aria-label="Home"
              icon={<FiHome />}
              size="sm"
              variant="ghost"
              onClick={() => navigateTo('C:\\Users\\User')}
            />
          </Tooltip>
          <Tooltip label="Desktop">
            <IconButton
              aria-label="Desktop"
              icon={<FiFolder />}
              size="sm"
              variant="ghost"
              onClick={() => navigateTo('C:\\Users\\User\\Desktop')}
            />
          </Tooltip>
          <Tooltip label="Documents">
            <IconButton
              aria-label="Documents"
              icon={<FiFileText />}
              size="sm"
              variant="ghost"
              onClick={() => navigateTo('C:\\Users\\User\\Documents')}
            />
          </Tooltip>
          <Tooltip label="Downloads">
            <IconButton
              aria-label="Downloads"
              icon={<FiDownload />}
              size="sm"
              variant="ghost"
              onClick={() => navigateTo('C:\\Users\\User\\Downloads')}
            />
          </Tooltip>
          <Tooltip label="This PC">
            <IconButton
              aria-label="C Drive"
              icon={<FiHardDrive />}
              size="sm"
              variant="ghost"
              onClick={() => navigateTo('C:')}
            />
          </Tooltip>
        </HStack>

        <HStack spacing={1} ml={2}>
          <Tooltip label="New Folder">
            <IconButton
              aria-label="New Folder"
              icon={<FiPlus />}
              size="sm"
              variant="ghost"
              onClick={() => setIsCreateFolderOpen(true)}
            />
          </Tooltip>
          <Tooltip label={clipboardOperation ? `Paste (${clipboardOperation})` : 'Paste'}>
            <IconButton
              aria-label="Paste"
              icon={<FiClipboard />}
              size="sm"
              variant="ghost"
              isDisabled={!clipboardOperation}
              onClick={pasteItem}
            />
          </Tooltip>
          {clipboardOperation && (
            <Badge colorScheme="blue" variant="subtle" fontSize="xs">
              {clipboardOperation === 'copy' ? 'Copy' : 'Cut'}
            </Badge>
          )}
        </HStack>

        <Box ml="auto">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
          <Tooltip label="Upload file">
            <IconButton
              aria-label="Upload"
              icon={<FiUpload />}
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            />
          </Tooltip>
        </Box>
      </Flex>

      {/* Address bar */}
      <Flex
        align="center"
        p={2}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <Breadcrumb flex={1} fontSize="sm" separator="\\">
          {getBreadcrumbs().map((crumb, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink
                onClick={() => navigateTo(crumb.path)}
                cursor="pointer"
                _hover={{ textDecor: 'underline' }}
                fontWeight={index === getBreadcrumbs().length - 1 ? 'bold' : 'normal'}
              >
                {crumb.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Flex>

      {/* File list */}
      <Box
        flex={1}
        overflowY="auto"
        p={2}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        bg={isDragOver ? dropZoneBg : 'transparent'}
        transition="background-color 0.2s"
      >
        {isDragOver ? (
          <Flex justify="center" align="center" h="100%" border="2px dashed" borderColor="blue.400" borderRadius="md">
            <VStack>
              <FiUpload size={48} color="blue" />
              <Text fontSize="lg" fontWeight="semibold" color="blue.500">
                Drop file here to upload
              </Text>
            </VStack>
          </Flex>
        ) : loading ? (
          <Flex justify="center" align="center" h="100%">
            <Spinner size="lg" />
          </Flex>
        ) : items.length === 0 ? (
          <Flex justify="center" align="center" h="100%" color="gray.500">
            <VStack>
              <FiFolder size={48} />
              <Text>This folder is empty</Text>
              <Text fontSize="sm" color="gray.400">
                Drag and drop files here or click the upload button
              </Text>
            </VStack>
          </Flex>
        ) : (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Date modified</Th>
                <Th>Type</Th>
                <Th>Size</Th>
                <Th w="40px"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item, index) => (
                <Tr
                  key={index}
                  cursor="pointer"
                  bg={selectedItem === item.path ? selectedBg : 'transparent'}
                  _hover={{ bg: hoverBg }}
                  onClick={() => setSelectedItem(item.path)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <Td>
                    <HStack spacing={2}>
                      {getFileIcon(item)}
                      <Text>{item.name}</Text>
                    </HStack>
                  </Td>
                  <Td>{formatDate(item.modified)}</Td>
                  <Td>{getFileTypeLabel(item)}</Td>
                  <Td>{formatSize(item.size)}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="More options"
                        icon={<FiMoreVertical />}
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item.path);
                        }}
                      />
                      <MenuList>
                        <MenuItem icon={<FiEdit2 />} onClick={() => {
                          setRenameTarget({ path: item.path, name: item.name });
                          setNewName(item.name);
                          setIsRenameOpen(true);
                        }}>
                          Rename
                        </MenuItem>
                        <MenuItem icon={<FiCopy />} onClick={() => copyItem(item)}>
                          Copy
                        </MenuItem>
                        <MenuItem icon={<FiScissors />} onClick={() => cutItem(item)}>
                          Cut
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => deleteItem(item)}>
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Status bar */}
      <Flex
        px={3}
        py={1}
        borderTop="1px solid"
        borderColor={borderColor}
        fontSize="xs"
        color="gray.500"
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        <Text>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
      </Flex>

      {/* Create Folder Modal */}
      <Modal isOpen={isCreateFolderOpen} onClose={() => setIsCreateFolderOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Folder</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createFolder()}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsCreateFolderOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={createFolder}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Rename Modal */}
      <Modal isOpen={isRenameOpen} onClose={() => setIsRenameOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="New name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && renameItem()}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={renameItem}>
              Rename
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
