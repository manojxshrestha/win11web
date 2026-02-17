import type { BoxProps, CenterProps } from '@chakra-ui/react';
import {
	Box,
	forwardRef,
	Text,
	useStyleConfig,
} from '@chakra-ui/react';
import { useCallback, useRef } from 'react';

import { useWindows } from '@/contexts/Windows';

export interface IconPosition {
	x: number;
	y: number;
}

// Grid configuration constants
export const GRID_CONFIG = {
	// Starting positions
	START_X: 20,
	START_Y: 60,
	// Icon dimensions
	ICON_WIDTH: 80,
	ICON_HEIGHT: 90,
	// Gaps
	GAP_X: 20,
	GAP_Y: 20,
	// Total cell size (icon + gap)
	CELL_WIDTH: 100, // 80 + 20
	CELL_HEIGHT: 110, // 90 + 20
} as const;

/**
 * Snap a position to the nearest grid cell
 * Icons can only move horizontally (same row) or vertically (same column)
 * based on the dominant drag direction
 */
export function snapToGrid(
	position: IconPosition,
	startPosition: IconPosition
): IconPosition {
	const { START_X, START_Y, CELL_WIDTH, CELL_HEIGHT } = GRID_CONFIG;

	// Calculate the grid column and row for the start position
	const startCol = Math.round((startPosition.x - START_X) / CELL_WIDTH);
	const startRow = Math.round((startPosition.y - START_Y) / CELL_HEIGHT);

	// Calculate the grid column and row for the current position
	const currentCol = Math.round((position.x - START_X) / CELL_WIDTH);
	const currentRow = Math.round((position.y - START_Y) / CELL_HEIGHT);

	// Determine if this is a horizontal or vertical drag
	const deltaX = Math.abs(position.x - startPosition.x);
	const deltaY = Math.abs(position.y - startPosition.y);

	if (deltaX > deltaY) {
		// Horizontal drag - keep the same row, snap to new column
		return {
			x: START_X + currentCol * CELL_WIDTH,
			y: START_Y + startRow * CELL_HEIGHT,
		};
	} else {
		// Vertical drag - keep the same column, snap to new row
		return {
			x: START_X + startCol * CELL_WIDTH,
			y: START_Y + currentRow * CELL_HEIGHT,
		};
	}
}

/**
 * Calculate grid position from pixel coordinates
 */
export function calculateGridPosition(position: IconPosition): IconPosition {
	const { START_X, START_Y, CELL_WIDTH, CELL_HEIGHT } = GRID_CONFIG;

	const col = Math.round((position.x - START_X) / CELL_WIDTH);
	const row = Math.round((position.y - START_Y) / CELL_HEIGHT);

	return {
		x: START_X + col * CELL_WIDTH,
		y: START_Y + row * CELL_HEIGHT,
	};
}

export interface DesktopIconProps extends Omit<ExecutableIconProps, 'position'>, CenterProps {
	iconSize?: BoxProps['boxSize'];
	iconPosition?: IconPosition;
	isDragging?: boolean;
	onPositionChange?: (position: IconPosition, isFinal?: boolean) => void;
	onDragStart?: () => void;
	onDragEnd?: (finalPosition?: IconPosition) => void;
	onDropOnRecycleBin?: (app: App, originalPosition: IconPosition) => void;
	recycleBinPosition?: IconPosition;
}

export const DesktopIcon = forwardRef<DesktopIconProps, 'div'>(
	(props, ref) => {
		const {
			app,
			children,
			iconPosition,
			isDragging,
			onPositionChange,
			onDragStart,
			onDragEnd,
			onDropOnRecycleBin,
			recycleBinPosition,
			iconSize,
			...rest
		} = props;

		const styles = useStyleConfig('DesktopIcon');

		const { addWindow } = useWindows();

		const handleAddWindow = useCallback(() => {
			addWindow(app);
		}, [app, addWindow]);

		// Track initial position for drag
		const dragInfoRef = useRef<{
			startX: number;
			startY: number;
			startPos: IconPosition;
			currentPos: IconPosition;
		} | null>(null);

		// Handle drag start with both mouse and touch
		const handleDragStartInternal = useCallback(
			(clientX: number, clientY: number) => {
				if (onPositionChange && iconPosition) {
					dragInfoRef.current = {
						startX: clientX,
						startY: clientY,
						startPos: { x: iconPosition.x, y: iconPosition.y },
						currentPos: { x: iconPosition.x, y: iconPosition.y },
					};
					onDragStart?.();
				}
			},
			[iconPosition, onPositionChange, onDragStart]
		);

		// Handle drag move with real-time grid snapping
		const handleDragMove = useCallback(
			(clientX: number, clientY: number) => {
				if (onPositionChange && dragInfoRef.current) {
					const { startX, startY, startPos } = dragInfoRef.current;
					const deltaX = clientX - startX;
					const deltaY = clientY - startY;

					// Calculate raw new position
					const rawPosition = {
						x: startPos.x + deltaX,
						y: startPos.y + deltaY,
					};

					// Snap to grid with horizontal/vertical constraint
					const snappedPosition = snapToGrid(rawPosition, startPos);

					// Update current position in ref
					dragInfoRef.current.currentPos = snappedPosition;

					// Send position update (not final)
					onPositionChange(snappedPosition, false);
				}
			},
			[onPositionChange]
		);

		// Check if position overlaps with Recycle Bin
		const checkRecycleBinCollision = useCallback((position: IconPosition): boolean => {
			if (!recycleBinPosition || app.processName === 'recycleBin') return false;

			const { ICON_WIDTH, ICON_HEIGHT } = GRID_CONFIG;

			// Check if the dragged icon bounds intersect with Recycle Bin bounds
			const iconLeft = position.x;
			const iconRight = position.x + ICON_WIDTH;
			const iconTop = position.y;
			const iconBottom = position.y + ICON_HEIGHT;

			const binLeft = recycleBinPosition.x;
			const binRight = recycleBinPosition.x + ICON_WIDTH;
			const binTop = recycleBinPosition.y;
			const binBottom = recycleBinPosition.y + ICON_HEIGHT;

			// Check for overlap (AABB collision detection)
			const overlapX = iconLeft < binRight && iconRight > binLeft;
			const overlapY = iconTop < binBottom && iconBottom > binTop;

			return overlapX && overlapY;
		}, [recycleBinPosition, app.processName]);

		// Handle drag end with final snap
		const handleDragEndInternal = useCallback(() => {
			const dragInfo = dragInfoRef.current;
			if (dragInfo && onPositionChange) {
				const finalPosition = dragInfo.currentPos;

				// Check if dropped on Recycle Bin
				if (checkRecycleBinCollision(finalPosition)) {
					// Get the original position before drag started
					const originalPosition = dragInfo.startPos;
					onDropOnRecycleBin?.(app, originalPosition);
				} else {
					// Send final position update
					onPositionChange(finalPosition, true);
				}
			}
			dragInfoRef.current = null;
			onDragEnd?.(dragInfo?.currentPos);
		}, [onPositionChange, onDragEnd, onDropOnRecycleBin, app, checkRecycleBinCollision]);

		// Mouse event handlers
		const handleMouseDown = useCallback(
			(e: React.MouseEvent) => {
				if (onPositionChange) {
					e.stopPropagation();
					handleDragStartInternal(e.clientX, e.clientY);

					const handleMouseMove = (moveEvent: MouseEvent) => {
						handleDragMove(moveEvent.clientX, moveEvent.clientY);
					};

					const handleMouseUp = () => {
						document.removeEventListener(
							'mousemove',
							handleMouseMove
						);
						document.removeEventListener('mouseup', handleMouseUp);
						handleDragEndInternal();
					};

					document.addEventListener('mousemove', handleMouseMove);
					document.addEventListener('mouseup', handleMouseUp);
				}
			},
			[onPositionChange, handleDragStartInternal, handleDragMove, handleDragEndInternal]
		);

		// Touch event handlers for mobile support
		const handleTouchStart = useCallback(
			(e: React.TouchEvent) => {
				if (onPositionChange && e.touches.length === 1) {
					e.stopPropagation();
					const touch = e.touches[0];
					if (touch) {
						handleDragStartInternal(touch.clientX, touch.clientY);

						const handleTouchMove = (moveEvent: TouchEvent) => {
							if (moveEvent.touches.length === 1) {
								const touchItem = moveEvent.touches[0];
								if (touchItem) {
									handleDragMove(touchItem.clientX, touchItem.clientY);
								}
							}
						};

						const handleTouchEnd = () => {
							document.removeEventListener(
								'touchmove',
								handleTouchMove
							);
							document.removeEventListener('touchend', handleTouchEnd);
							handleDragEndInternal();
						};

						document.addEventListener('touchmove', handleTouchMove, {
							passive: false,
						});
						document.addEventListener('touchend', handleTouchEnd);
					}
				}
			},
			[onPositionChange, handleDragStartInternal, handleDragMove, handleDragEndInternal]
		);

		// Calculate position styles
		const positionStyle = iconPosition
			? {
					left: `${iconPosition.x}px`,
					top: `${iconPosition.y}px`,
					position: 'absolute' as const,
				}
			: {};

		return (
			<Box
				__css={styles}
				className={`desktop-icon ${isDragging ? 'dragging' : ''}`}
				cursor={onPositionChange ? 'grab' : 'default'}
				onDoubleClick={handleAddWindow}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
				ref={ref}
				style={positionStyle}
				transition={isDragging ? 'none' : 'all 0.15s ease'}
				zIndex={isDragging ? 1000 : 1}
				{...rest}
			>
				<Box
					boxSize={iconSize ?? '60px'}
					draggable={false}
					margin="0 auto"
					pointerEvents="none"
					unselectable="on"
					userSelect="none"
				>
					{app.icon}
				</Box>

				<Text noOfLines={2}>{children ?? app.fullName}</Text>
			</Box>
		);
	}
);
