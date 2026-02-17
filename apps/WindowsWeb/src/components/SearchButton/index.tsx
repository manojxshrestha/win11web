'use client';

import {
	Box,
	HStack,
	Text,
	Tooltip,
	useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { IoSearch } from 'react-icons/io5';

import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	Input,
	InputGroup,
	InputLeftElement,
	VStack,
	Grid,
	Icon,
	useDisclosure,
} from '@chakra-ui/react';
import { AnimatePresence, motion as motionFramer } from 'framer-motion';
import { apps } from '@/components/Apps/apps';
import { useWindows } from '@/contexts/Windows';
import type { MouseEventHandler } from 'react';

const MotionBox = motion(Box);
const MotionPopoverContent = motionFramer(PopoverContent);

// Windows Logo SVG Component
const WindowsLogo = ({ size = 14 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 21 21"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L21 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H21V24l-10.051-1.801" />
	</svg>
);

// Animation variants
const panelVariants = {
	hidden: {
		opacity: 0,
		y: -10,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 300,
			damping: 25,
		},
	},
	exit: {
		opacity: 0,
		y: -10,
		scale: 0.95,
		transition: {
			duration: 0.15,
		},
	},
};

export function SearchButton() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [searchQuery, setSearchQuery] = useState('');
	const { addWindow } = useWindows();

	const backgroundColor = useColorModeValue(
		'rgba(255, 255, 255, 0.85)',
		'rgba(32, 32, 32, 0.85)'
	);
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const textColor = useColorModeValue('gray.800', 'white');
	const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

	const handleAddWindow = useCallback(
		(app: App): MouseEventHandler<HTMLElement> =>
			() => {
				onClose();
				addWindow(app);
				setSearchQuery('');
			},
		[addWindow, onClose]
	);

	const filteredApps = Object.values(apps).filter((app) => {
		if (!searchQuery.trim()) return false;
		const query = searchQuery.toLowerCase();
		return (
			app.fullName.toLowerCase().includes(query) ||
			app.shortName.toLowerCase().includes(query)
		);
	});

	const recentSearches = ['Settings', 'File Explorer', 'Edge', 'Terminal'];

	// Windows 11 search bar colors
	const searchBarBg = useColorModeValue(
		'rgba(255, 255, 255, 0.85)',
		'rgba(43, 43, 43, 0.75)'
	);
	const searchBarBorder = useColorModeValue(
		'rgba(0, 0, 0, 0.06)',
		'rgba(255, 255, 255, 0.08)'
	);
	const searchBarHoverBg = useColorModeValue(
		'rgba(255, 255, 255, 0.95)',
		'rgba(55, 55, 55, 0.85)'
	);
	const iconColor = useColorModeValue('gray.500', 'gray.400');

	return (
		<Popover
			isOpen={isOpen}
			onOpen={onOpen}
			onClose={onClose}
			placement="top-start"
			offset={[0, 16]}
		>
			<PopoverTrigger>
				<Tooltip label="Search" openDelay={1000}>
					<MotionBox
						as="button"
						aria-label="Search"
						display="flex"
						alignItems="center"
						justifyContent="center"
						gap={2}
						px={4}
						py={2}
						borderRadius="full"
						bg={searchBarBg}
						border="1px solid"
						borderColor={searchBarBorder}
						backdropFilter="blur(20px)"
						boxShadow="0 2px 6px rgba(0, 0, 0, 0.06)"
						whileHover={{ 
							scale: 1.02,
							bg: searchBarHoverBg,
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
						}}
						whileTap={{ scale: 0.98 }}
						transition={{
							type: 'spring',
							stiffness: 400,
							damping: 17,
						}}
						cursor="pointer"
						sx={{
							'&:hover': {
								bg: searchBarHoverBg,
							}
						}}
					>
						{/* Search Text */}
						<Text
							fontSize="sm"
							fontWeight="normal"
							color={textColor}
							userSelect="none"
							letterSpacing="0.3px"
						>
							Search
						</Text>
						
						{/* Magnifying Glass Icon */}
						<Box 
							color={iconColor}
							display="flex"
							alignItems="center"
							justifyContent="center"
						>
							<IoSearch size={16} />
						</Box>
					</MotionBox>
				</Tooltip>
			</PopoverTrigger>

			<AnimatePresence>
				{isOpen && (
					<MotionPopoverContent
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={panelVariants}
						w="600px"
						bg={backgroundColor}
						borderColor={borderColor}
						backdropFilter="blur(20px)"
						boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
						borderRadius="xl"
						overflow="hidden"
					>
						<PopoverBody p={4}>
							<VStack spacing={4} align="stretch">
								{/* Search Input */}
								<InputGroup size="md">
									<InputLeftElement pointerEvents="none">
										<Icon as={IoSearch} boxSize={5} color={secondaryTextColor} />
									</InputLeftElement>
									<Input
										pl={10}
										placeholder="Type here to search"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										borderRadius="lg"
										bg={useColorModeValue('whiteAlpha.500', 'blackAlpha.300')}
										_focus={{
											bg: useColorModeValue('whiteAlpha.700', 'blackAlpha.400'),
											boxShadow: 'outline',
										}}
									/>
								</InputGroup>

								{/* Search Results or Recent */}
								{searchQuery.trim() ? (
									<VStack align="stretch" spacing={2}>
										<Text fontSize="sm" fontWeight="semibold" color={textColor}>
											Apps
										</Text>
										{filteredApps.length > 0 ? (
											<Grid templateColumns="repeat(4, 1fr)" gap={2}>
												{filteredApps.slice(0, 8).map((app) => (
													<Box
														key={app.processName}
														p={2}
														borderRadius="md"
														cursor="pointer"
														_hover={{
															bg: useColorModeValue('gray.100', 'whiteAlpha.200'),
														}}
														onClick={handleAddWindow(app)}
														textAlign="center"
													>
														<Box boxSize="40px" mx="auto" mb={1}>
															{app.icon}
														</Box>
														<Text fontSize="xs" color={textColor} noOfLines={1}>
															{app.shortName}
														</Text>
													</Box>
												))}
											</Grid>
										) : (
											<Text color={secondaryTextColor} fontSize="sm" py={4} textAlign="center">
												No results found for "{searchQuery}"
											</Text>
										)}
									</VStack>
								) : (
									<VStack align="stretch" spacing={2}>
										<Text fontSize="sm" fontWeight="semibold" color={textColor}>
											Recent
										</Text>
										{recentSearches.map((search) => (
											<HStack
												key={search}
												p={2}
												borderRadius="md"
												cursor="pointer"
												_hover={{
													bg: useColorModeValue('gray.100', 'whiteAlpha.200'),
												}}
												onClick={() => {
													const app = Object.values(apps).find(
														(a) => a.shortName === search
													);
													if (app) {
														handleAddWindow(app)();
													}
												}}
											>
												<Icon as={IoSearch} boxSize={4} color={secondaryTextColor} />
												<Text fontSize="sm" color={textColor}>
													{search}
												</Text>
											</HStack>
										))}
									</VStack>
								)}
							</VStack>
						</PopoverBody>
					</MotionPopoverContent>
				)}
			</AnimatePresence>
		</Popover>
	);
}

export default SearchButton;
