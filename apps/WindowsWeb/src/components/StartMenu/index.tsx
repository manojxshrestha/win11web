'use client';

import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	type CardProps,
	forwardRef,
	Grid,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	VStack,
	useColorModeValue,
} from '@chakra-ui/react';
import type { ChangeEvent, MouseEventHandler } from 'react';
import { useCallback, useState, useMemo } from 'react';
import { IoSearch } from 'react-icons/io5';
import { MdLockOutline } from 'react-icons/md';
import { RiUserSettingsLine } from 'react-icons/ri';
import { SlArrowRight, SlPower } from 'react-icons/sl';
import { VscFile, VscFileCode, VscFileMedia, VscSignOut } from 'react-icons/vsc';

import { apps } from '@/components/Apps/apps';
import { useWindows } from '@/contexts/Windows';

// Curated list of pinned apps for Windows 11 style
const pinnedApps = [
	apps.edge,
	apps.word,
	apps.excel,
	apps.powerpoint,
	apps.outlook,
	apps.chat,
	apps.store,
	apps.photos,
	apps.spotify,
	apps.notepad,
	apps.calculator,
	apps.fileExplorer,
	apps.settings,
	apps.terminal,
	apps.vscode,
	apps.github,
	apps.chrome,
	apps.mail,
	apps.solitaire,
	apps.xbox,
];

// Recommended items - simulating recently used files
interface RecommendedItem {
	id: string;
	name: string;
	type: 'file' | 'folder' | 'app';
	icon: React.ReactNode;
	timestamp: string;
	app?: App;
}

const recommendedItems: RecommendedItem[] = [
	{
		id: '1',
		name: 'Project Report.docx',
		type: 'file',
		icon: <Icon as={VscFile} boxSize={5} />,
		timestamp: 'Just now',
	},
	{
		id: '2',
		name: 'Budget 2024.xlsx',
		type: 'file',
		icon: <Icon as={VscFile} boxSize={5} />,
		timestamp: '2 hours ago',
	},
	{
		id: '3',
		name: 'Presentation.pptx',
		type: 'file',
		icon: <Icon as={VscFile} boxSize={5} />,
		timestamp: 'Yesterday',
	},
	{
		id: '4',
		name: 'Downloads',
		type: 'folder',
		icon: <Icon as={VscFileMedia} boxSize={5} />,
		timestamp: 'Yesterday',
	},
	{
		id: '5',
		name: 'Notes.txt',
		type: 'file',
		icon: <Icon as={VscFileCode} boxSize={5} />,
		timestamp: '3 days ago',
	},
	{
		id: '6',
		name: 'Contract.pdf',
		type: 'file',
		icon: <Icon as={VscFile} boxSize={5} />,
		timestamp: 'Last week',
	},
	{
		id: '7',
		name: 'Edge',
		type: 'app',
		icon: apps.edge.icon,
		timestamp: 'Just now',
		app: apps.edge,
	},
	{
		id: '8',
		name: 'File Explorer',
		type: 'app',
		icon: apps.fileExplorer.icon,
		timestamp: '1 hour ago',
		app: apps.fileExplorer,
	},
];

type StartMenuProps = CardProps & {
	onClose: () => void;
};

export const StartMenu = forwardRef<StartMenuProps, 'div'>(
	(props, ref) => {
		const { onClose, ...rest } = props;

		const { addWindow } = useWindows();
		const [searchQuery, setSearchQuery] = useState('');

		const handleAddWindow = useCallback(
			(app: App): MouseEventHandler<HTMLElement> =>
				(event) => {
					event.stopPropagation();
					onClose();
					addWindow(app);
				},
			[addWindow, onClose]
		);

		const handleRecommendedItemClick = useCallback(
			(item: RecommendedItem): MouseEventHandler<HTMLElement> =>
				(event) => {
					event.stopPropagation();
					onClose();
					if (item.app) {
						addWindow(item.app);
					}
				},
			[addWindow, onClose]
		);

		const handleRestart = useCallback(() => {
			if (typeof window !== 'undefined') window.location.reload();
		}, []);

		const handleShutdown = useCallback(() => {
			// In a real app, this would trigger actual shutdown
			console.log('Shutting down...');
		}, []);

		const handleAllApps = useCallback(() => {
			// Could open a full apps list view
			console.log('Open all apps');
		}, []);

		const handleRecommendedMore = useCallback(() => {
			// Could show more recommended items
			console.log('Show more recommended');
		}, []);

		const filteredApps = useMemo(() => {
			if (!searchQuery.trim()) return null;
			const query = searchQuery.toLowerCase();
			return Object.values(apps).filter(
				(app) =>
					app.fullName.toLowerCase().includes(query) ||
					app.shortName.toLowerCase().includes(query)
			);
		}, [searchQuery]);

		const backgroundColor = useColorModeValue(
			'rgba(255, 255, 255, 0.7)',
			'rgba(0, 0, 0, 0.3)'
		);
		const hoverBackgroundColor = useColorModeValue(
			'rgba(255, 255, 255, 0.9)',
			'rgba(255, 255, 255, 0.1)'
		);
		const cardBackgroundColor = useColorModeValue(
			'rgba(243, 243, 243, 0.85)',
			'rgba(32, 32, 32, 0.85)'
		);
		const itemHoverBackground = useColorModeValue('gray.200', 'whiteAlpha.200');
		const textColor = useColorModeValue('gray.800', 'white');
		const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

		return (
			<Card
				backgroundColor={cardBackgroundColor}
				borderRadius="xl"
				boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
				cursor="default"
				height="680px"
				overflow="hidden"
				ref={ref as React.Ref<HTMLDivElement>}
				backdropFilter="blur(20px)"
				userSelect="none"
				width="640px"
				{...rest}
			>
				<CardHeader pb={2}>
					<InputGroup size="sm">
						<InputLeftElement ml={2} pointerEvents="none">
							<Icon as={IoSearch} boxSize={4} color={secondaryTextColor} />
						</InputLeftElement>
						<Input
							pl={10}
							pr={4}
							placeholder="Search for apps, settings, and documents"
							value={searchQuery}
							borderRadius="full"
							bg={backgroundColor}
							_hover={{ bg: hoverBackgroundColor }}
							_focus={{ bg: hoverBackgroundColor, boxShadow: 'outline' }}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setSearchQuery(e.target.value)
							}
						/>
					</InputGroup>
				</CardHeader>

				<CardBody px={6} py={0}>
					<Box overflowY="auto" maxHeight="480px">
						<VStack align="stretch" spacing={4}>
							{filteredApps ? (
								<>
									<Text
										fontSize="sm"
										fontWeight="semibold"
										color={textColor}
									>
										Search Results
									</Text>
									{filteredApps.length > 0 ? (
										<Grid
											gap={2}
											gridTemplateColumns="repeat(4, 1fr)"
											justifyItems="center"
										>
											{filteredApps.map((app) => (
												<StartMenuAppItem
													key={app.shortName}
													app={app}
													onClick={handleAddWindow(app)}
												/>
											))}
										</Grid>
									) : (
										<Text
											color={secondaryTextColor}
											fontSize="sm"
											py={4}
											textAlign="center"
										>
											No apps found for "{searchQuery}"
										</Text>
									)}
								</>
							) : (
								<>
									{/* Pinned Apps Section */}
									<HStack justifyContent="space-between" align="center">
										<Text
											fontSize="sm"
											fontWeight="semibold"
											color={textColor}
										>
											Pinned
										</Text>

										<Button
											background={backgroundColor}
											borderRadius="md"
											color={textColor}
											rightIcon={
												<Icon as={SlArrowRight} boxSize={3} ml={1} />
											}
											size="xs"
											variant="ghost"
											_hover={{ bg: itemHoverBackground }}
											onClick={handleAllApps}
										>
											All apps
										</Button>
									</HStack>

									<Grid
										gap={2}
										gridTemplateColumns="repeat(6, 1fr)"
										gridTemplateRows="repeat(3, 1fr)"
										justifyItems="center"
									>
										{pinnedApps.map((app) => (
											<StartMenuAppItem
												key={app.shortName}
												app={app}
												onClick={handleAddWindow(app)}
											/>
										))}
									</Grid>

									{/* Recommended Section */}
									<HStack justifyContent="space-between" align="center" pt={2}>
										<Text
											fontSize="sm"
											fontWeight="semibold"
											color={textColor}
										>
											Recommended
										</Text>

										<Button
											background={backgroundColor}
											borderRadius="md"
											color={textColor}
											rightIcon={
												<Icon as={SlArrowRight} boxSize={3} ml={1} />
											}
											size="xs"
											variant="ghost"
											_hover={{ bg: itemHoverBackground }}
											onClick={handleRecommendedMore}
										>
											More
										</Button>
									</HStack>

									<Grid
										gap={2}
										gridTemplateColumns="repeat(4, 1fr)"
										gridTemplateRows="repeat(2, 1fr)"
									>
										{recommendedItems.slice(0, 8).map((item) => (
											<RecommendedItemComponent
												key={item.id}
												item={item}
												onClick={handleRecommendedItemClick(item)}
											/>
										))}
									</Grid>
								</>
							)}
						</VStack>
					</Box>
				</CardBody>

				<CardFooter
					justifyContent="space-between"
					pt={2}
					borderTop="1px solid"
					borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
				>
					<Menu placement="top" size="sm">
						<MenuButton
							as={Button}
							borderRadius="md"
							color={textColor}
							leftIcon={
								<Box
									bg={useColorModeValue('blue.500', 'blue.400')}
									borderRadius="full"
									boxSize={8}
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									<Text color="white" fontSize="sm" fontWeight="bold">
										M
									</Text>
								</Box>
							}
							py={5}
							variant="ghost"
							_hover={{ bg: itemHoverBackground }}
						>
							<Text fontSize="sm">Manoj Shrestha</Text>
						</MenuButton>
						<MenuList
							bg={cardBackgroundColor}
							backdropFilter="blur(10px)"
							borderRadius="md"
							boxShadow="lg"
						>
							<MenuItem
								icon={<Icon as={RiUserSettingsLine} />}
								_hover={{ bg: itemHoverBackground }}
							>
								Change account settings
							</MenuItem>
							<MenuItem
								icon={<Icon as={MdLockOutline} />}
								_hover={{ bg: itemHoverBackground }}
							>
								Lock
							</MenuItem>
							<MenuItem
								icon={<Icon as={VscSignOut} />}
								_hover={{ bg: itemHoverBackground }}
							>
								Sign out
							</MenuItem>
						</MenuList>
					</Menu>

					<Menu placement="top" size="sm">
						<MenuButton
							aria-label="Power"
							as={IconButton}
							borderRadius="md"
							color={textColor}
							icon={<Icon as={SlPower} boxSize={5} />}
							variant="ghost"
							_hover={{ bg: itemHoverBackground }}
						/>
						<MenuList
							bg={cardBackgroundColor}
							backdropFilter="blur(10px)"
							borderRadius="md"
							boxShadow="lg"
							minWidth="140px"
						>
							<MenuItem
								_hover={{ bg: itemHoverBackground }}
								onClick={handleRestart}
							>
								Restart
							</MenuItem>
							<MenuItem
								_hover={{ bg: itemHoverBackground }}
								onClick={handleShutdown}
							>
								Shut down
							</MenuItem>
						</MenuList>
					</Menu>
				</CardFooter>
			</Card>
		);
	}
);

// Start Menu App Item Component
function StartMenuAppItem({
	app,
	onClick,
}: {
	app: App;
	onClick: MouseEventHandler<HTMLElement>;
}) {
	const textColor = useColorModeValue('gray.800', 'white');
	const hoverBackground = useColorModeValue('gray.100', 'whiteAlpha.200');

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			padding={2}
			borderRadius="md"
			cursor="pointer"
			_hover={{ bg: hoverBackground }}
			transition="background 0.15s ease"
			onClick={onClick}
			role="button"
			tabIndex={0}
		onKeyDown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onClick(e as unknown as React.MouseEvent<HTMLElement>);
			}
		}}
		>
			<Box
				boxSize="44px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				mb={1}
			>
				{app.icon}
			</Box>
			<Text
				fontSize="xs"
				noOfLines={1}
				textAlign="center"
				color={textColor}
				maxW="60px"
			>
				{app.shortName}
			</Text>
		</Box>
	);
}

// Recommended Item Component
function RecommendedItemComponent({
	item,
	onClick,
}: {
	item: RecommendedItem;
	onClick: MouseEventHandler<HTMLElement>;
}) {
	const textColor = useColorModeValue('gray.800', 'white');
	const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
	const hoverBackground = useColorModeValue('gray.100', 'whiteAlpha.200');

	return (
		<Box
			display="flex"
			alignItems="center"
			gap={3}
			padding={2}
			borderRadius="md"
			cursor="pointer"
			_hover={{ bg: hoverBackground }}
			transition="background 0.15s ease"
			onClick={onClick}
			role="button"
			tabIndex={0}
		onKeyDown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onClick(e as unknown as React.MouseEvent<HTMLElement>);
			}
		}}
		>
			<Box
				boxSize="32px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				color={secondaryTextColor}
			>
				{item.icon}
			</Box>
			<Box flex={1} minW={0}>
				<Text
					fontSize="xs"
					noOfLines={1}
					color={textColor}
					fontWeight="medium"
				>
					{item.name}
				</Text>
				<Text fontSize="xs" color={secondaryTextColor}>
					{item.timestamp}
				</Text>
			</Box>
		</Box>
	);
}
