'use client';

import { Box, Grid, useDisclosure } from '@chakra-ui/react';
import {
	type MouseEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';

import { AppContextMenu } from '@/components/AppContextMenu';
import { DesktopContextMenu } from '@/components/DesktopContextMenu';
import { DesktopIcon, type IconPosition, GRID_CONFIG, calculateGridPosition } from '@/components/DesktopIcon';
import { defaultDesktopApps } from '@/constants/defaultDesktopApps';
import { TerminalApp } from '@/components/Apps/apps';
import { useWindows } from '@/contexts/Windows';
import { useRecycleBin } from '@/contexts/RecycleBinContext';
import { useSystem } from '@/contexts/System';

const STORAGE_KEY = 'desktop-icon-positions';

// Default grid layout positions for initial load
const getDefaultPositions = (): Record<string, IconPosition> => {
	const positions: Record<string, IconPosition> = {};
	const { START_X, START_Y, CELL_WIDTH, CELL_HEIGHT } = GRID_CONFIG;

	// Calculate max columns based on typical screen width (assuming 1920px)
	const maxCols = Math.floor((1920 - START_X) / CELL_WIDTH);

	defaultDesktopApps.forEach((app, index) => {
		const col = index % maxCols;
		const row = Math.floor(index / maxCols);
		positions[app.processName] = {
			x: START_X + col * CELL_WIDTH,
			y: START_Y + row * CELL_HEIGHT,
		};
	});

	return positions;
};

export default function Home() {
	const desktopMenuDisclosure = useDisclosure();

	const appMenuDisclosure = useDisclosure();

	const [selectedApp, setSelectedApp] = useState<App | null>(null);
	const selectedAppRef = useRef<HTMLDivElement>(null);

	/**
	 * Two position states are needed because when it changes, the menu
	 * still have to animate out and it needs to happen from the
	 * previous position.
	 */
	const [menuPosition, setMenuPosition] = useState({
		x: 0,
		y: 0,
	});
	const [appMenuPosition, setAppMenuPosition] = useState({
		x: 0,
		y: 0,
	});

	// Icon positions state
	const [iconPositions, setIconPositions] = useState<Record<string, IconPosition>>(() => {
		if (typeof window === 'undefined') {
			return getDefaultPositions();
		}
		
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				return JSON.parse(stored);
			}
		} catch {
			console.warn('Failed to load icon positions from localStorage');
		}
		
		return getDefaultPositions();
	});

	// Currently dragging icon
	const [draggingIcon, setDraggingIcon] = useState<string | null>(null);

	// Track deleted apps (moved to Recycle Bin)
	const [deletedApps, setDeletedApps] = useState<Set<string>>(() => {
		if (typeof window === 'undefined') {
			return new Set();
		}
		try {
			const stored = localStorage.getItem('desktop-deleted-apps');
			if (stored) {
				return new Set(JSON.parse(stored));
			}
		} catch {
			console.warn('Failed to load deleted apps from localStorage');
		}
		return new Set();
	});

	// Get Recycle Bin context
	const { addItem } = useRecycleBin();

	// Get window management functions
	const { addWindow } = useWindows();

	// Get system settings (including showDesktopIcons)
	const { showDesktopIcons } = useSystem();

	// Handle desktop refresh
	const handleDesktopRefresh = useCallback(() => {
		console.log('Refreshing desktop...');
		// Force a re-render by updating a state
		setIconPositions((prev) => ({ ...prev }));
	}, []);

	// Handle opening terminal at desktop location
	const handleOpenTerminal = useCallback(() => {
		addWindow(TerminalApp);
	}, [addWindow]);

	// Save positions to localStorage whenever they change
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(iconPositions));
		} catch {
			console.warn('Failed to save icon positions to localStorage');
		}
	}, [iconPositions]);

	// Save deleted apps to localStorage whenever they change
	useEffect(() => {
		try {
			localStorage.setItem('desktop-deleted-apps', JSON.stringify(Array.from(deletedApps)));
		} catch {
			console.warn('Failed to save deleted apps to localStorage');
		}
	}, [deletedApps]);

	const handleContextMenu = useCallback<
		MouseEventHandler<HTMLDivElement>
	>(
		(e) => {
			e.preventDefault();

			if (
				(e.target as HTMLElement).className.includes(
					'desktop-icon'
				) ||
				(e.target as HTMLElement).tagName === 'P'
			) {
				console.log('Clicked desktop icon, not opening menu.');
				desktopMenuDisclosure.onClose();

				return;
			}

			setMenuPosition({
				x: e.clientX,
				y: e.clientY,
			});

			appMenuDisclosure.onClose();
			desktopMenuDisclosure.onOpen();
		},
		[appMenuDisclosure, desktopMenuDisclosure]
	);

	const handleAppContextMenu = useCallback(
		(app: App): MouseEventHandler<HTMLDivElement> =>
			(e) => {
				e.preventDefault();
				setSelectedApp(app);

				console.group('App menu');
				console.log('App:', app);
				console.log('Event:', e.clientX, e.clientY);
				console.groupEnd();

				setAppMenuPosition({
					x: e.clientX,
					y: e.clientY,
				});

				appMenuDisclosure.onOpen();
			},
		[appMenuDisclosure]
	);

	const handlePositionChange = useCallback((app: App, position: IconPosition, isFinal?: boolean) => {
		// Always ensure the position is snapped to grid
		const snappedPosition = calculateGridPosition(position);

		setIconPositions((prev) => ({
			...prev,
			[app.processName]: snappedPosition,
		}));
	}, []);

	const handleDragStart = useCallback((processName: string) => {
		setDraggingIcon(processName);
	}, []);

	const handleDragEnd = useCallback(() => {
		setDraggingIcon(null);
	}, []);

	// Handle dropping an app on the Recycle Bin
	const handleDropOnRecycleBin = useCallback((app: App, originalPosition: IconPosition) => {
		// Add app to deleted set
		setDeletedApps((prev) => new Set([...prev, app.processName]));

		// Add to Recycle Bin context with desktop app type
		addItem({
			name: app.fullName,
			originalPath: `Desktop\\${app.fullName}`,
			size: 0,
			type: 'desktopApp',
			appData: {
				processName: app.processName,
				originalPosition: originalPosition,
			},
		});

		console.log(`Moved ${app.fullName} to Recycle Bin`);
	}, [addItem]);

	// Handle restoring a desktop app from Recycle Bin
	const handleRestoreDesktopApp = useCallback((event: Event) => {
		const customEvent = event as CustomEvent<{
			processName: string;
			originalPosition: { x: number; y: number };
			itemId: string;
		}>;
		const { processName, originalPosition } = customEvent.detail;

		// Remove from deleted apps set
		setDeletedApps((prev) => {
			const newSet = new Set(prev);
			newSet.delete(processName);
			return newSet;
		});

		// Restore original position
		setIconPositions((prev) => ({
			...prev,
			[processName]: originalPosition,
		}));

		console.log(`Restored ${processName} to desktop`);
	}, []);

	// Listen for desktop app restore events
	useEffect(() => {
		const RESTORE_DESKTOP_APP_EVENT = 'restoreDesktopApp';
		window.addEventListener(RESTORE_DESKTOP_APP_EVENT, handleRestoreDesktopApp);
		return () => {
			window.removeEventListener(RESTORE_DESKTOP_APP_EVENT, handleRestoreDesktopApp);
		};
	}, [handleRestoreDesktopApp]);

	const [targets, setTargets] = useState<
		(HTMLElement | SVGElement)[]
	>([]);
	const moveableRef = useRef<Moveable>(null);
	const selectoRef = useRef<Selecto>(null);
	const dragContainerRef = useRef<HTMLDivElement>(null);

	// Don't render moveable/selecto if we have custom drag implementation
	const showMoveable = false;

	return (
		<main ref={dragContainerRef}>
			{showMoveable && (
				<>
					<Moveable
						bounds={{
							left: 0,
							top: 0,
							right: 0,
							bottom: 0,
							position: 'css',
						}}
						ref={moveableRef}
						snapContainer={dragContainerRef.current}
						snappable
						target={targets}
						draggable
						// eslint-disable-next-line react-perf/jsx-no-new-function-as-prop -- ignore
						onRender={(e) => {
							e.target.style.cssText += e.cssText;
						}}
						origin={false}
						/*  eslint-disable react-perf/jsx-no-new-function-as-prop -- ignore */
						onClickGroup={(e) => {
							selectoRef.current?.clickTarget(
								e.inputEvent as MouseEvent | TouchEvent,
								e.inputTarget
							);
						}}
						onRenderGroup={(e) => {
							e.events.forEach((ev) => {
								ev.target.style.cssText += ev.cssText;
							});
						}}
						/* eslint-enable react-perf/jsx-no-new-function-as-prop */
					/>
					<Selecto
						boundContainer
						continueSelect={false}
						continueSelectWithoutDeselect
						dragContainer={dragContainerRef.current}
						ref={selectoRef}
						selectByClick
						selectFromInside
						selectableTargets={['.desktop-icon']}
						toggleContinueSelect="shift"
						toggleContinueSelectWithoutDeselect={[['ctrl'], ['meta']]}
						hitRate={0}
						// eslint-disable-next-line react-perf/jsx-no-new-function-as-prop -- ignore
						onSelect={(e) => {
							e.added.forEach((el) => {
								el.classList.add('selected');
							});
							e.removed.forEach((el) => {
								el.classList.remove('selected');
							});

							setTargets(e.selected);
						}}
						ratio={0}
						/*  eslint-disable react-perf/jsx-no-new-function-as-prop -- ignore */
						onDragStart={(event) => {
							const target = (event.inputEvent as MouseEvent | TouchEvent)
								.target as Element;

							if (
								moveableRef.current?.isMoveableElement(target) ||
								targets.some((t) => t === target || t.contains(target))
							) {
								event.stop();
							}
						}}
						onSelectEnd={(event) => {
							if (event.isDragStartEnd) {
								(
									event.inputEvent as MouseEvent | TouchEvent
								).preventDefault();

								void moveableRef.current
									?.waitToChangeTarget()
									.then(
										() =>
											moveableRef.current?.dragStart(
												event.inputEvent as MouseEvent | TouchEvent
											)
									);
							}

							setTargets(event.selected);
						}}
						/* eslint-enable react-perf/jsx-no-new-function-as-prop */
					/>
				</>
			)}

			{/* Container for absolute positioned icons */}
			<Box
				position="absolute"
				top={0}
				left={0}
				right={0}
				bottom={0}
				onContextMenu={handleContextMenu}
				zIndex={1}
			>
				{showDesktopIcons[0] && defaultDesktopApps
					.filter((app) => !deletedApps.has(app.processName))
					.map((app) => (
						<DesktopIcon
							app={app}
							className={`desktop-icon ${
								app === selectedApp && appMenuDisclosure.isOpen
									? 'selected'
									: ''
							} ${draggingIcon === app.processName ? 'dragging' : ''}`}
							isDragging={draggingIcon === app.processName}
							key={app.processName}
							onContextMenu={handleAppContextMenu(app)}
							onPositionChange={(pos) => handlePositionChange(app, pos)}
							onDragStart={() => handleDragStart(app.processName)}
							onDragEnd={handleDragEnd}
							onDropOnRecycleBin={handleDropOnRecycleBin}
							recycleBinPosition={iconPositions['recycleBin']}
							iconPosition={iconPositions[app.processName]}
						/>
					))}
			</Box>

			<DesktopContextMenu
				position={menuPosition}
				{...desktopMenuDisclosure}
				onRefresh={handleDesktopRefresh}
				onOpenTerminal={handleOpenTerminal}
				showDesktopIcons={showDesktopIcons[0]}
				onShowDesktopIconsChange={showDesktopIcons[1].toggle}
			/>

			{selectedApp ? (
				<AppContextMenu
					app={selectedApp}
					position={appMenuPosition}
					{...appMenuDisclosure}
				/>
			) : null}
		</main>
	);
}
