'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
	Box,
	ButtonGroup,
	Card,
	CardBody,
	CardHeader,
	type CardProps,
	HStack,
	Icon,
	IconButton,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useSize } from '@chakra-ui/react-use-size';
import type { MouseEventHandler, SyntheticEvent } from 'react';
import { BiSquareRounded } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { VscChromeMinimize } from 'react-icons/vsc';
import { type Props, Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { SnapLayout, type SnapLayoutType } from '../SnapLayout';

// Windows 11 style animation variants
const windowOpenVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

const windowMinimizeVariants = {
  minimized: {
    opacity: 0,
    scale: 0.7,
    y: 50,
    transition: {
      type: 'tween',
      duration: 0.2,
      ease: 'circIn',
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

const windowMaximizeVariants = {
  maximized: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  normal: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

export interface WindowContainerProps
	extends Omit<CardProps, 'onFocus'> {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	isMaximized: boolean;
	isMinimized: boolean;
	isFocused: boolean;
	zIndex: number;
	onMinimize: MouseEventHandler<HTMLButtonElement>;
	onMaximize: MouseEventHandler<HTMLButtonElement>;
	onSnapLayout?: (layout: SnapLayoutType) => void;
	onFocus: (event?: SyntheticEvent) => void;
	onClose: MouseEventHandler<HTMLButtonElement>;
	initialPosition: Props['default'];
	windowId: string;
	anchorTargetRef?: React.RefObject<HTMLButtonElement>;
}

const staticPosition = {
	x: 0,
	y: 0,
};

const MotionCard = motion(Card);

export function WindowContainer(props: WindowContainerProps) {
	const {
		title,
		icon,
		children,
		isMaximized,
		isMinimized,
		isFocused,
		zIndex,
		onMinimize,
		onMaximize,
		onSnapLayout,
		onFocus,
		onClose,
		anchorTargetRef,
		initialPosition,
		windowId,
		...rest
	} = props;

	useLayoutEffect(() => {
		onFocus();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
	}, []);

	const mainRef = useRef<HTMLElement | null>(null);
	const maximizeButtonRef = useRef<HTMLButtonElement>(null);

	if (!mainRef.current && typeof window !== 'undefined')
		mainRef.current = document.querySelectorAll('main')[0] ?? null;

	const maxSize = useSize(mainRef);

	const [rndState, setState] = useState({
		x: initialPosition?.x ?? 0,
		y: initialPosition?.y ?? 0,
		width: initialPosition?.width ?? 100,
		height: initialPosition?.height ?? 100,
	});

	// Snap layout state
	const [snapLayoutOpen, setSnapLayoutOpen] = useState(false);
	const snapLayoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const scrollBarColor = useColorModeValue('gray.600', 'gray.500');

	// Handle maximize button hover for snap layout
	const handleMaximizeMouseEnter = useCallback(() => {
		if (snapLayoutTimeoutRef.current) {
			clearTimeout(snapLayoutTimeoutRef.current);
		}
		snapLayoutTimeoutRef.current = setTimeout(() => {
			if (!isMaximized) {
				setSnapLayoutOpen(true);
			}
		}, 200);
	}, [isMaximized]);

	const handleMaximizeMouseLeave = useCallback(() => {
		if (snapLayoutTimeoutRef.current) {
			clearTimeout(snapLayoutTimeoutRef.current);
		}
	}, []);

	const handleSnapLayoutClose = useCallback(() => {
		setSnapLayoutOpen(false);
	}, []);

	const handleSnapLayoutSelect = useCallback((layout: SnapLayoutType) => {
		setSnapLayoutOpen(false);
		onSnapLayout?.(layout);
	}, [onSnapLayout]);

	// Handle snap to edges during drag
	const handleDragStop = useCallback((_e: any, d: { x: number; y: number }) => {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const snapThreshold = 20;
		
		let newX = d.x;
		let newY = d.y;
		
		// Snap to left edge
		if (Math.abs(newX) < snapThreshold) {
			newX = 0;
		}
		// Snap to right edge
		if (Math.abs(newX + (typeof rndState.width === 'number' ? rndState.width : parseInt(rndState.width as string, 10)) - viewportWidth) < snapThreshold) {
			newX = viewportWidth - (typeof rndState.width === 'number' ? rndState.width : parseInt(rndState.width as string, 10));
		}
		// Snap to top edge
		if (Math.abs(newY) < snapThreshold) {
			newY = 0;
		}
		// Snap to bottom edge (above taskbar)
		if (Math.abs(newY + (typeof rndState.height === 'number' ? rndState.height : parseInt(rndState.height as string, 10)) - viewportHeight + 48) < snapThreshold) {
			newY = viewportHeight - (typeof rndState.height === 'number' ? rndState.height : parseInt(rndState.height as string, 10)) + 48;
		}
		
		setState((prev) => ({
			x: newX,
			y: newY,
			width: prev.width,
			height: prev.height,
		}));
	}, [rndState]);

	// Handle restore from maximized
	const handleRestore = useCallback((e: React.MouseEvent<Element>) => {
		if (onMaximize) {
			onMaximize(e as unknown as React.MouseEvent<HTMLButtonElement>);
		}
	}, [onMaximize]);

	return (
		<Rnd
			bounds="main"
			default={initialPosition}
			dragHandleClassName="handle"
			minHeight="100px"
			minWidth="140px"
			position={isMaximized ? staticPosition : rndState}
			size={isMaximized ? maxSize : rndState}
			style={{
				// eslint-disable-next-line no-inline-styles/no-inline-styles -- style prop is needed to style Rnd
				zIndex: zIndex,
				opacity: isMinimized ? 0 : 1,
				pointerEvents: isMinimized ? 'none' : 'auto',
			}}
			disableDragging={isMaximized}
			enableResizing={!isMaximized}
			/* eslint-disable react-perf/jsx-no-new-function-as-prop -- ignore */
			onDragStop={(_e, d) => {
				handleDragStop(_e, d);
			}}
			onResizeStop={(_e, _direction, ref, _delta, position) => {
				setState({
					width: ref.style.width,
					height: ref.style.height,
					...position,
				});
			}}
			/* eslint-enable react-perf/jsx-no-new-function-as-prop */
		>
			<MotionCard
				animate={isMinimized ? windowMinimizeVariants.minimized : windowMinimizeVariants.visible}
				initial={windowOpenVariants.hidden}
				boxShadow={isFocused ? 'dark-lg' : 'base'}
				exit={{
					opacity: 0,
					scale: 0.9,
					transition: {
						type: 'tween',
						duration: 0.15,
						ease: 'circIn',
					},
				}}
				filter={
					isFocused
						? 'brightness(1)'
						: 'brightness(0.9) contrast(0.9) '
				}
				height="100%"
				onClick={onFocus}
				variant="window"
				borderBottomRadius={isMaximized ? '0' : 'md'}
				{...rest}
			>
				<CardHeader className="handle">
					<HStack
						_active={{ cursor: 'grabbing' }}
						cursor="grab"
						justifyContent="space-between"
					>
						<HStack overflow="hidden">
							<Box
								draggable={false}
								flexShrink={0}
								pointerEvents="none"
								unselectable="on"
								userSelect="none"
								w="22px"
							>
								{icon}
							</Box>
							<Text fontSize="md" noOfLines={1}>
								{title}
							</Text>
						</HStack>
						<ButtonGroup
							colorScheme="gray"
							cursor="default"
							size="sm"
							spacing={1}
							variant="ghost"
						>
							<IconButton
								aria-label="minimize"
								borderRadius="none"
								boxShadow="none"
								icon={<Icon as={VscChromeMinimize} boxSize={5} />}
								onClick={onMinimize}
							/>
						<IconButton
							ref={maximizeButtonRef}
							aria-label={isMaximized ? 'restore' : 'maximize'}
							borderRadius="none"
							boxShadow="none"
							icon={<Icon as={BiSquareRounded} boxSize={4} />}
							onClick={isMaximized ? handleRestore : onMaximize}
							onMouseEnter={handleMaximizeMouseEnter}
							onMouseLeave={handleMaximizeMouseLeave}
						/>

							<IconButton
								aria-label="close"
								borderRadius="none"
								borderTopRightRadius="md"
								boxShadow="none"
								colorScheme="red"
								icon={<Icon as={IoClose} boxSize={5} />}
								onClick={onClose}
							/>
						</ButtonGroup>
					</HStack>
				</CardHeader>

				<CardBody
					overflowY="scroll"
					sx={{
						'&::-webkit-scrollbar': {
							width: '4px',
						},
						// scrollbarWidth: 'thin',
						scrollbarColor: `${scrollBarColor} transparent`,
						'&::-webkit-scrollbar-track': {
							bgColor: 'transparent',
						},
						'&::-webkit-scrollbar-thumb': {
							bgColor: scrollBarColor,
							borderRadius: 'xl',
						},
					}}
				>
					{children}
				</CardBody>
			</MotionCard>
			{/* Snap Layout Popup */}
			<AnimatePresence>
				{snapLayoutOpen && (
					<SnapLayout
						isOpen={snapLayoutOpen}
						onClose={handleSnapLayoutClose}
						onSelect={handleSnapLayoutSelect}
						windowId={windowId}
						anchorRef={maximizeButtonRef}
					/>
				)}
			</AnimatePresence>
		</Rnd>
	);
}
