import {
	Box,
	chakra,
	HStack,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import {
	ContextMenu,
	type ContextMenuProps,
} from '@repo/ui/components';
import { AnimatePresence, motion } from 'framer-motion';
import type { ChangeEventHandler, FocusEventHandler, ReactNode } from 'react';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { BsBrush, BsGrid, BsSearch } from 'react-icons/bs';
import { CgMoreR } from 'react-icons/cg';
import { RiArrowRightSLine } from 'react-icons/ri';
import { TbReload } from 'react-icons/tb';

import { TerminalIcon } from '@/assets/ TerminalIcon';
import { AddIcon } from '@/assets/AddIcon';
import { DisplaySettingsIcon } from '@/assets/DisplaySettingsIcon';
import { SortIcon } from '@/assets/SortIcon';
import { SettingsApp, apps, TerminalApp } from '@/components/Apps/apps';
import { useWindows } from '@/contexts/Windows';

import { NewSubmenu } from './NewSubmenu';
import { SortbySubmenu } from './SortbySubmenu';
import { ViewSubmenu } from './ViewSubmenu';

const MotionDivWithStyles = motion(chakra.div);

type Submenu = 'view' | 'sortby' | 'new';

type DesktopContextMenuProps = Omit<ContextMenuProps, 'children'> & {
	onRefresh?: () => void;
	onOpenTerminal?: () => void;
	onDisplaySettings?: () => void;
	onPersonalize?: () => void;
	showDesktopIcons?: boolean;
	onShowDesktopIconsChange?: (show: boolean) => void;
};

export function DesktopContextMenu(props: DesktopContextMenuProps) {
	const { isOpen, onRefresh, onOpenTerminal, onDisplaySettings, onPersonalize } = props;

	const { addWindow } = useWindows();

	const submenuDisclosure = useDisclosure();

	const [submenu, setSubmenu] = useState<Submenu | null>(null);
	const [submenuPosition, setSubmenuPosition] = useState({
		x: 0,
		y: 0,
	});

	const [searchQuery, setSearchQuery] = useState('');

	const submenusMap: Record<Submenu, ReactNode> = {
		view: (
			<ViewSubmenu
				showDesktopIcons={props.showDesktopIcons}
				onShowDesktopIconsChange={props.onShowDesktopIconsChange}
			/>
		),
		sortby: <SortbySubmenu />,
		new: <NewSubmenu />,
	};

	const handleOpenSubmenu = useCallback(
		(menu: Submenu): FocusEventHandler<HTMLButtonElement> =>
			(event) => {
				setSubmenu(menu);
				setSubmenuPosition({
					x: event.currentTarget.getBoundingClientRect().width + 4,
					y: event.currentTarget.offsetTop,
				});
				submenuDisclosure.onOpen();
			},
		[submenuDisclosure]
	);

	useLayoutEffect(() => {
		if (!isOpen) {
			submenuDisclosure.onClose();
			setSearchQuery('');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- Only when isOpen changes
	}, [isOpen]);

	const handleAddWindow = useCallback(
		(app: App) => () => {
			addWindow(app);
		},
		[addWindow]
	);

	const handleSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
		(event) => {
			setSearchQuery(event.target.value);
		},
		[]
	);

	const filteredApps = useMemo(() => {
		if (!searchQuery.trim()) {
			return [];
		}
		const query = searchQuery.toLowerCase();
		return Object.values(apps).filter(
			(app) =>
				app.shortName.toLowerCase().includes(query) ||
				app.fullName.toLowerCase().includes(query)
		);
	}, [searchQuery]);

	const showSearchResults = searchQuery.trim().length > 0;

	const handleRefresh = useCallback(() => {
		if (onRefresh) {
			onRefresh();
		}
		submenuDisclosure.onClose();
	}, [onRefresh, submenuDisclosure]);

	const handleTerminalOpen = useCallback(() => {
		if (onOpenTerminal) {
			onOpenTerminal();
		} else {
			addWindow(TerminalApp);
		}
		submenuDisclosure.onClose();
	}, [addWindow, onOpenTerminal, submenuDisclosure]);

	const handleDisplaySettings = useCallback(() => {
		if (onDisplaySettings) {
			onDisplaySettings();
		} else {
			addWindow(SettingsApp);
		}
		submenuDisclosure.onClose();
	}, [addWindow, onDisplaySettings, submenuDisclosure]);

	const handlePersonalize = useCallback(() => {
		if (onPersonalize) {
			onPersonalize();
		} else {
			addWindow(SettingsApp);
		}
		submenuDisclosure.onClose();
	}, [addWindow, onPersonalize, submenuDisclosure]);

	return (
		<ContextMenu size="sm" {...props}>
			<MenuList>
				{/* Search Input */}
				<Box px={2} py={2}>
					<InputGroup size="sm">
						<InputLeftElement pointerEvents="none">
							<Icon as={BsSearch} color="gray.500" />
						</InputLeftElement>
						<Input
							placeholder="Search apps"
							value={searchQuery}
							onChange={handleSearchChange}
							borderRadius="md"
							bg="gray.100"
							_placeholder={{ color: 'gray.500' }}
							_focus={{ bg: 'white', borderColor: 'blue.400' }}
						/>
					</InputGroup>
				</Box>

				{/* Search Results */}
				{showSearchResults && (
					<>
						<MenuDivider />
						<VStack align="stretch" spacing={0} maxHeight="200px" overflowY="auto">
							{filteredApps.length > 0 ? (
								filteredApps.map((app) => (
									<MenuItem
										key={app.processName}
										icon={app.icon as React.ReactElement | undefined}
										onClick={handleAddWindow(app)}
										onFocus={submenuDisclosure.onClose}
										_hover={{ bg: 'hoverBg' }}
									>
										<Text>{app.shortName}</Text>
									</MenuItem>
								))
							) : (
								<MenuItem
									onFocus={submenuDisclosure.onClose}
									_hover={{ bg: 'transparent' }}
									cursor="default"
									pointerEvents="none"
								>
									<Text color="gray.500" fontSize="sm">
										No apps found
									</Text>
								</MenuItem>
							)}
						</VStack>
						<MenuDivider />
					</>
				)}

				{/* Regular Menu Items */}
				{!showSearchResults && (
					<>
						<MenuItem
							bg={
								submenuDisclosure.isOpen && submenu === 'view'
									? 'hoverBg'
									: undefined
							}
							icon={<Icon as={BsGrid} />}
							onFocus={handleOpenSubmenu('view')}
						>
							<HStack justifyContent="space-between">
								<Text>View</Text>
								<Icon as={RiArrowRightSLine} boxSize={4} mr={-1.5} />
							</HStack>
						</MenuItem>

						<MenuItem
							bg={
								submenuDisclosure.isOpen && submenu === 'sortby'
									? 'hoverBg'
									: undefined
							}
							icon={<SortIcon />}
							onFocus={handleOpenSubmenu('sortby')}
						>
							<HStack justifyContent="space-between">
								<Text>Sort by</Text>
								<Icon as={RiArrowRightSLine} boxSize={4} mr={-1.5} />
							</HStack>
						</MenuItem>
						<MenuItem
							icon={<Icon as={TbReload} />}
							onClick={handleRefresh}
							onFocus={submenuDisclosure.onClose}
						>
							Refresh
						</MenuItem>
						<MenuDivider />
						<MenuItem
							bg={
								submenuDisclosure.isOpen && submenu === 'new'
									? 'hoverBg'
									: undefined
							}
							icon={<AddIcon boxSize="20px" />}
							onFocus={handleOpenSubmenu('new')}
						>
							<HStack justifyContent="space-between">
								<Text>New</Text>
								<Icon as={RiArrowRightSLine} boxSize={4} mr={-1.5} />
							</HStack>
						</MenuItem>
						<MenuDivider />
						<MenuItem
							icon={<DisplaySettingsIcon boxSize="19px" />}
							onClick={handleDisplaySettings}
							onFocus={submenuDisclosure.onClose}
						>
							Display Settings
						</MenuItem>
						<MenuItem
							icon={<Icon as={BsBrush} />}
							onClick={handlePersonalize}
							onFocus={submenuDisclosure.onClose}
						>
							Personalize
						</MenuItem>
						<MenuDivider />
						<MenuItem
							icon={<TerminalIcon />}
							onClick={handleTerminalOpen}
							onFocus={submenuDisclosure.onClose}
						>
							Terminal here
						</MenuItem>
						<MenuDivider />
						<MenuItem
							icon={
								<Icon
									as={CgMoreR}
									sx={{
										'& path:nth-child(-n+3)': {
											fill: 'blue.400',
										},
									}}
								/>
							}
							onFocus={submenuDisclosure.onClose}
						>
							Show more options
						</MenuItem>
					</>
				)}
			</MenuList>

			<AnimatePresence>
				{submenuDisclosure.isOpen ? (
					<MotionDivWithStyles
						animate={{ x: 0 }}
						exit={{ scale: 0.9 }}
						initial={{ x: -20 }}
						layout="position"
						left={`${submenuPosition.x}px`}
						position="absolute"
						top={`${submenuPosition.y}px`}
						transition={{
							type: 'tween',
							ease: 'circOut',
							duration: 0.2,
						}}
						zIndex={3}
					>
						{submenu ? submenusMap[submenu] : null}
					</MotionDivWithStyles>
				) : null}
			</AnimatePresence>
		</ContextMenu>
	);
}
