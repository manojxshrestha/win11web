'use client';

import {
	Box,
	Button,
	Divider,
	Flex,
	Grid,
	HStack,
	Icon,
	IconButton,
	Text,
	VStack,
	useColorModeValue,
	Portal,
} from '@chakra-ui/react';
import { useState, useCallback, useEffect } from 'react';
import {
	FiPlus,
	FiMonitor,
	FiMaximize2,
	FiX,
} from 'react-icons/fi';
import { useWindows } from '@/contexts/Windows';
import { getEntries, getValues } from '@/utils/getEntries';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualDesktop {
	id: string;
	name: string;
}

interface TaskViewProps {
	onClose: () => void;
}

// Animation variants
const overlayVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.2 } },
	exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
	hidden: { opacity: 0, scale: 0.95, y: 20 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			type: 'spring',
			stiffness: 300,
			damping: 25,
			delay: 0.1,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		y: 20,
		transition: { duration: 0.2 },
	},
};

const desktopVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay: i * 0.1,
			type: 'spring',
			stiffness: 300,
			damping: 25,
		},
	}),
};

const windowVariants = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: (i: number) => ({
		opacity: 1,
		scale: 1,
		transition: {
			delay: i * 0.05,
			type: 'spring',
			stiffness: 300,
			damping: 25,
		},
	}),
};

// Task View Component - Virtual Desktops and Running Apps Overview
export function TaskView({ onClose }: TaskViewProps) {
	const { windows, focusWindow, minimize, closeWindow } = useWindows();
	const panelBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const hoverBg = useColorModeValue('gray.100', 'gray.700');
	const desktopBg = useColorModeValue('blue.50', 'blue.900');
	const activeDesktopBg = useColorModeValue('blue.100', 'blue.800');
	const textColor = useColorModeValue('gray.800', 'white');
	const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

	const [desktops, setDesktops] = useState<VirtualDesktop[]>([
		{ id: '1', name: 'Desktop 1' },
	]);
	const [activeDesktop, setActiveDesktop] = useState('1');

	// Handle keyboard shortcut (Escape to close)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onClose]);

	const handleAddDesktop = useCallback(() => {
		const newId = String(desktops.length + 1);
		setDesktops([...desktops, { id: newId, name: `Desktop ${newId}` }]);
	}, [desktops]);

	const handleCloseDesktop = useCallback((id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (desktops.length > 1) {
			const newDesktops = desktops.filter((d) => d.id !== id);
			setDesktops(newDesktops);
			if (activeDesktop === id && newDesktops.length > 0) {
				setActiveDesktop(newDesktops[0]!.id);
			}
		}
	}, [desktops, activeDesktop]);

	const handleWindowClick = useCallback((process: string, windowId: number) => {
		minimize.off(process as any, windowId);
		focusWindow(process as any, windowId);
		onClose();
	}, [minimize, focusWindow, onClose]);

	const handleCloseWindow = useCallback((e: React.MouseEvent, process: string, windowId: number) => {
		e.stopPropagation();
		closeWindow(process as any, windowId);
	}, [closeWindow]);

	// Get all running windows grouped by process
	const runningProcesses = getEntries(windows).filter(
		([, processWindows]) => Object.keys(processWindows).length > 0
	);

	return (
		<Portal>
			<AnimatePresence>
				<motion.div
					initial="hidden"
					animate="visible"
					exit="exit"
					variants={overlayVariants}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: useColorModeValue(
							'rgba(0, 0, 0, 0.3)',
							'rgba(0, 0, 0, 0.6)'
						),
						zIndex: 9999,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					onClick={onClose}
				>
					<motion.div
						variants={panelVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						style={{
							backgroundColor: panelBg,
							borderRadius: '16px',
							width: '900px',
							height: '600px',
							overflow: 'hidden',
							boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<HStack
							justify="space-between"
							p={4}
							borderBottomWidth="1px"
							borderColor={borderColor}
						>
							<Text fontSize="lg" fontWeight="semibold" color={textColor}>
								Task view
							</Text>
							<IconButton
								aria-label="Close"
								icon={<FiX />}
								size="sm"
								variant="ghost"
								onClick={onClose}
								_hover={{ bg: hoverBg }}
							/>
						</HStack>

						<Grid templateColumns="250px 1fr" h="calc(100% - 60px)">
							{/* Virtual Desktops Sidebar */}
							<Box borderRightWidth="1px" borderColor={borderColor} p={4}>
								<Text
									fontSize="sm"
									fontWeight="medium"
									color={secondaryTextColor}
									mb={3}
								>
									Virtual desktops
								</Text>
								<VStack spacing={2} align="stretch">
									{desktops.map((desktop, index) => (
										<motion.div
											key={desktop.id}
											custom={index}
											variants={desktopVariants}
											initial="hidden"
											animate="visible"
										>
											<HStack
												p={3}
												borderRadius="md"
												bg={
													activeDesktop === desktop.id
														? activeDesktopBg
														: 'transparent'
												}
												_hover={{
													bg:
														activeDesktop === desktop.id
															? activeDesktopBg
															: hoverBg,
												}}
												cursor="pointer"
												onClick={() => setActiveDesktop(desktop.id)}
												justify="space-between"
												transition="all 0.2s"
											>
												<HStack>
													<Icon
														as={FiMonitor}
														boxSize={4}
														color={
															activeDesktop === desktop.id
																? 'blue.500'
																: secondaryTextColor
														}
													/>
													<Text
														fontSize="sm"
														color={
															activeDesktop === desktop.id
																? 'blue.500'
																: textColor
														}
														fontWeight={
															activeDesktop === desktop.id
																? 'semibold'
																: 'normal'
														}
													>
														{desktop.name}
													</Text>
												</HStack>
												{desktops.length > 1 && (
													<IconButton
														aria-label="Close desktop"
														icon={<FiX />}
														size="xs"
														variant="ghost"
														opacity={0}
														_hover={{ opacity: 1 }}
														onClick={(e) => handleCloseDesktop(desktop.id, e)}
													/>
												)}
											</HStack>
										</motion.div>
									))}
									<Button
										leftIcon={<FiPlus />}
										variant="ghost"
										size="sm"
										onClick={handleAddDesktop}
										mt={2}
										color={secondaryTextColor}
										_hover={{ bg: hoverBg }}
									>
										Add desktop
									</Button>
								</VStack>
							</Box>

							{/* Running Windows */}
							<Box p={4} overflowY="auto">
								<Text
									fontSize="sm"
									fontWeight="medium"
									color={secondaryTextColor}
									mb={3}
								>
									Open windows on{' '}
									{desktops.find((d) => d.id === activeDesktop)?.name}
								</Text>

								{runningProcesses.length === 0 ? (
									<Flex
										direction="column"
										align="center"
										justify="center"
										h="200px"
										color={secondaryTextColor}
									>
										<Icon as={FiMaximize2} boxSize={8} mb={2} />
										<Text>No open windows</Text>
									</Flex>
								) : (
									<Grid
										templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
										gap={3}
									>
										{runningProcesses.map(
											([process, processWindows], processIndex) =>
												getValues(processWindows).map(
													(window, windowIndex) => (
														<motion.div
															key={`${process}-${(window as App & { id?: number }).id ?? 0}`}
															custom={processIndex + windowIndex}
															variants={windowVariants}
															initial="hidden"
															animate="visible"
														>
															<Box
																p={3}
																borderRadius="md"
																borderWidth="1px"
																borderColor={borderColor}
																_hover={{
																	borderColor: 'blue.400',
																	cursor: 'pointer',
																	transform: 'translateY(-2px)',
																	boxShadow: 'md',
																}}
																transition="all 0.2s"
																onClick={() =>
																	handleWindowClick(
																		process,
																		(window as App & { id?: number }).id ?? 0
																	)
																}
																position="relative"
																role="group"
															>
																<IconButton
																	aria-label="Close window"
																	icon={<FiX />}
																	size="xs"
																	variant="ghost"
																	position="absolute"
																	top={1}
																	right={1}
																	opacity={0}
																	_groupHover={{ opacity: 1 }}
																	transition="opacity 0.2s"
																	onClick={(e) =>
																		handleCloseWindow(
																			e,
																			process,
																			(window as App & { id?: number }).id ?? 0
																		)
																	}
																	colorScheme="red"
																/>
																<HStack spacing={3}>
																	<Box
																		boxSize="40px"
																		borderRadius="md"
																		overflow="hidden"
																	>
																		{window.icon}
																	</Box>
																	<VStack align="start" spacing={0}>
																		<Text
																			fontSize="sm"
																			fontWeight="medium"
																			color={textColor}
																			noOfLines={1}
																			>
																			{window.shortName}
																		</Text>
																		<Text
																			fontSize="xs"
																			color={secondaryTextColor}
																			noOfLines={1}
																			>
																			{(window as App & { title?: string }).title ||
																				'Window'}
																		</Text>
																	</VStack>
																</HStack>
															</Box>
														</motion.div>
													)
											)
										)}
									</Grid>
								)}
							</Box>
						</Grid>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</Portal>
	);
}

export default TaskView;
