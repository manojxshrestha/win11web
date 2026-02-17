'use client';

import { Box, HStack, IconButton, Image, Text, Tooltip } from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';

interface BrowserTabProps {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
  onClose: () => void;
  onClick: () => void;
}

export function BrowserTab({ title, url, isActive, onClose, onClick, favicon }: BrowserTabProps) {
  const displayTitle = title || 'New Tab';
  const shortTitle = displayTitle.length > 20 ? `${displayTitle.substring(0, 20)}...` : displayTitle;

  return (
    <HStack
      px={3}
      py={2}
      bg={isActive ? 'white' : 'rgba(255, 255, 255, 0.7)'}
      borderTopRadius="lg"
      borderBottom={isActive ? 'none' : '1px solid'}
      borderColor="gray.300"
      spacing={2}
      cursor="pointer"
      onClick={onClick}
      maxW="200px"
      minW="120px"
      _hover={{ bg: isActive ? 'white' : 'rgba(255, 255, 255, 0.9)' }}
      transition="all 0.2s"
      position="relative"
      mr={1}
    >
      {/* Favicon or default icon */}
      {favicon ? (
        <Image
          src={favicon}
          alt="favicon"
          w="16px"
          h="16px"
          fallback={<Box w="16px" h="16px" bg="blue.500" borderRadius="sm" />}
        />
      ) : (
        <Box w="16px" h="16px" bg="blue.500" borderRadius="sm" />
      )}

      <Tooltip label={`${displayTitle} - ${url}`} placement="bottom">
        <Text fontSize="sm" fontWeight="normal" color="gray.800" noOfLines={1} flex={1}>
          {shortTitle}
        </Text>
      </Tooltip>

      <IconButton
        aria-label="Close tab"
        icon={<FiX />}
        size="xs"
        variant="ghost"
        color="gray.600"
        _hover={{ bg: 'gray.200', color: 'gray.900' }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        borderRadius="full"
      />
    </HStack>
  );
}
