'use client';

import { Box, HStack, useColorModeValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';

export type SnapLayoutType =
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface SnapLayoutProps {
  isOpen: boolean;
  onSelect: (layout: SnapLayoutType) => void;
  onClose: () => void;
  windowId: string;
  anchorRef?: React.RefObject<HTMLElement>;
}

const MotionBox = motion(Box);

// Windows 11 style snap zones - 6 layouts in a row
// Layout 1: 50/50 split (left)
// Layout 2: 50/50 split (right)
// Layout 3: 66/33 split (left large)
// Layout 4: 33/66 split (right large)
// Layout 5: Top/bottom split (top)
// Layout 6: Top/bottom split (bottom)

interface SnapZone {
  id: SnapLayoutType;
  icon: React.ReactNode;
}

export function SnapLayout({
  isOpen,
  onSelect,
  onClose,
  windowId,
  anchorRef,
}: SnapLayoutProps) {
  const [hoveredZone, setHoveredZone] = useState<SnapLayoutType | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  // Windows 11 style glassmorphism colors
  const bgColor = useColorModeValue(
    'rgba(243, 243, 243, 0.95)',
    'rgba(32, 32, 32, 0.95)'
  );
  const borderColor = useColorModeValue(
    'rgba(200, 200, 200, 0.5)',
    'rgba(80, 80, 80, 0.5)'
  );
  const hoverBg = useColorModeValue(
    'rgba(0, 120, 212, 0.15)',
    'rgba(0, 120, 212, 0.25)'
  );
  const hoverBorder = useColorModeValue(
    'rgba(0, 120, 212, 0.6)',
    'rgba(0, 120, 212, 0.8)'
  );
  const zoneBg = useColorModeValue(
    'rgba(230, 230, 230, 0.8)',
    'rgba(60, 60, 60, 0.8)'
  );
  const zoneHoverBg = useColorModeValue(
    'rgba(0, 120, 212, 0.8)',
    'rgba(0, 120, 212, 0.9)'
  );

  // Calculate popup position based on anchor element
  useEffect(() => {
    if (isOpen && anchorRef?.current && popupRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      
      // Position above the anchor button, centered horizontally
      const top = anchorRect.top - popupRect.height - 12;
      const left = anchorRect.left + anchorRect.width / 2 - popupRect.width / 2;
      
      setPopupPosition({ top, left });
    }
  }, [isOpen, anchorRef]);

  const handleMouseEnter = useCallback((zone: SnapLayoutType) => {
    setHoveredZone(zone);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredZone(null);
  }, []);

  const handleSelect = useCallback(
    (layout: SnapLayoutType) => {
      onSelect(layout);
      setHoveredZone(null);
    },
    [onSelect]
  );

  // Calculate snap position and size based on layout
  const getSnapBounds = useCallback(
    (layout: SnapLayoutType): { x: number; y: number; width: number; height: number } => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const taskbarHeight = 48;

      switch (layout) {
        case 'left':
          return {
            x: 0,
            y: 0,
            width: viewportWidth / 2,
            height: viewportHeight - taskbarHeight,
          };
        case 'right':
          return {
            x: viewportWidth / 2,
            y: 0,
            width: viewportWidth / 2,
            height: viewportHeight - taskbarHeight,
          };
        case 'top-left':
          return {
            x: 0,
            y: 0,
            width: viewportWidth / 2,
            height: (viewportHeight - taskbarHeight) / 2,
          };
        case 'top-right':
          return {
            x: viewportWidth / 2,
            y: 0,
            width: viewportWidth / 2,
            height: (viewportHeight - taskbarHeight) / 2,
          };
        case 'bottom-left':
          return {
            x: 0,
            y: (viewportHeight - taskbarHeight) / 2,
            width: viewportWidth / 2,
            height: (viewportHeight - taskbarHeight) / 2,
          };
        case 'bottom-right':
          return {
            x: viewportWidth / 2,
            y: (viewportHeight - taskbarHeight) / 2,
            width: viewportWidth / 2,
            height: (viewportHeight - taskbarHeight) / 2,
          };
        default:
          return {
            x: 0,
            y: 0,
            width: viewportWidth,
            height: viewportHeight - taskbarHeight,
          };
      }
    },
    []
  );

  // Snap zone icons/components
  const renderZoneIcon = (zoneId: SnapLayoutType, isHovered: boolean) => {
    const fillColor = isHovered ? zoneHoverBg : zoneBg;
    const strokeColor = isHovered ? 'white' : 'rgba(150, 150, 150, 0.8)';

    switch (zoneId) {
      case 'left':
        return (
          <svg width="40" height="30" viewBox="0 0 40 30">
            <rect
              x="2"
              y="2"
              width="36"
              height="26"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1"
            />
            <rect
              x="4"
              y="4"
              width="16"
              height="22"
              rx="1"
              fill={isHovered ? 'white' : 'rgba(180, 180, 180, 0.8)'}
            />
          </svg>
        );
      case 'right':
        return (
          <svg width="40" height="30" viewBox="0 0 40 30">
            <rect
              x="2"
              y="2"
              width="36"
              height="26"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1"
            />
            <rect
              x="20"
              y="4"
              width="16"
              height="22"
              rx="1"
              fill={isHovered ? 'white' : 'rgba(180, 180, 180, 0.8)'}
            />
          </svg>
        );
      case 'top-left':
        return (
          <svg width="40" height="30" viewBox="0 0 40 30">
            <rect
              x="2"
              y="2"
              width="36"
              height="26"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1"
            />
            <rect
              x="4"
              y="4"
              width="32"
              height="10"
              rx="1"
              fill={isHovered ? 'white' : 'rgba(180, 180, 180, 0.8)'}
            />
          </svg>
        );
      case 'top-right':
        return (
          <svg width="40" height="30" viewBox="0 0 40 30">
            <rect
              x="2"
              y="2"
              width="36"
              height="26"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1"
            />
            <rect
              x="4"
              y="16"
              width="32"
              height="10"
              rx="1"
              fill={isHovered ? 'white' : 'rgba(180, 180, 180, 0.8)'}
            />
          </svg>
        );
      case 'bottom-left':
        return (
          <svg width="40" height="30" viewBox="0 0 40 30">
            <rect
              x="2"
              y="2"
              width="36"
              height="26"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1"
            />
            <rect
              x="4"
              y="4"
              width="14"
              height="22"
              rx="1"
              fill={isHovered ? 'white' : 'rgba(180, 180, 180, 0.8)'}
            />
            <rect
              x="22"
              y="4"
              width="14"
              height="22"
              rx="1"
              fill={isHovered ? 'white' : 'rgba(180, 180, 180, 0.8)'}
            />
          </svg>
        );
      case 'bottom-right':
        return (
          <svg width="40" height="30" viewBox="0 0 40 30">
            <rect
              x="2"
              y="2"
              width="36"
              height="26"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1"
            />
            <rect
              x="4"
              y="4"
              width="10"
              height="22"
              rx="1"
              fill={isHovered ? 'white' : 'rgba(180, 180, 180, 0.8)'}
            />
            <rect
              x="18"
              y="4"
              width="18"
              height="22"
              rx="1"
              fill={isHovered ? 'white' : 'rgba(180, 180, 180, 0.8)'}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const snapZones: SnapZone[] = [
    { id: 'left', icon: renderZoneIcon('left', hoveredZone === 'left') },
    { id: 'right', icon: renderZoneIcon('right', hoveredZone === 'right') },
    { id: 'top-left', icon: renderZoneIcon('top-left', hoveredZone === 'top-left') },
    { id: 'top-right', icon: renderZoneIcon('top-right', hoveredZone === 'top-right') },
    { id: 'bottom-left', icon: renderZoneIcon('bottom-left', hoveredZone === 'bottom-left') },
    { id: 'bottom-right', icon: renderZoneIcon('bottom-right', hoveredZone === 'bottom-right') },
  ];

  // Handle click outside to close
  const handleBackdropClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={9998}
            onClick={handleBackdropClick}
          />

          {/* Snap Preview Overlay */}
          <AnimatePresence>
            {hoveredZone && (
              <MotionBox
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                position="fixed"
                {...getSnapBounds(hoveredZone)}
                bg="rgba(0, 120, 212, 0.25)"
                border="2px solid rgba(0, 120, 212, 0.6)"
                borderRadius="8px"
                pointerEvents="none"
                zIndex={9997}
                boxShadow="0 0 20px rgba(0, 120, 212, 0.3)"
              />
            )}
          </AnimatePresence>

          {/* Snap Layout Menu */}
          <MotionBox
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            position="fixed"
            top={`${popupPosition.top}px`}
            left={`${popupPosition.left}px`}
            bg={bgColor}
            borderRadius="12px"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15)"
            border="1px solid"
            borderColor={borderColor}
            p="12px"
            zIndex={9999}
            backdropFilter="blur(20px) saturate(180%)"
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            <HStack spacing="8px">
              {snapZones.map((zone) => (
                <MotionBox
                  key={zone.id}
                  position="relative"
                  p="6px"
                  borderRadius="8px"
                  cursor="pointer"
                  bg={hoveredZone === zone.id ? hoverBg : 'transparent'}
                  border="1.5px solid"
                  borderColor={
                    hoveredZone === zone.id ? hoverBorder : 'transparent'
                  }
                  onMouseEnter={() => handleMouseEnter(zone.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleSelect(zone.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  {renderZoneIcon(zone.id, hoveredZone === zone.id)}
                </MotionBox>
              ))}
            </HStack>
          </MotionBox>
        </>
      )}
    </AnimatePresence>
  );
}
