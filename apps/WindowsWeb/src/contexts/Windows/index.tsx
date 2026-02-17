'use client';

import { Box, Center, Portal } from '@chakra-ui/react';
import { WindowContainer, type SnapLayoutType } from '@repo/ui/components';
import { AnimatePresence } from 'framer-motion';
import type { MouseEventHandler, SyntheticEvent } from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

import type { Process } from '@/components/Apps/apps';
import { useWindowsReducer } from '@/contexts/Windows/useWindowsReducer';
import { getEntries } from '@/utils/getEntries';

import { windowsContextDefaultValues } from './helpers';
import type { WindowPosition, WindowsContext as WindowsContextType, WindowsProviderProps } from './Windows';

const WindowsContext = createContext<WindowsContextType>(
	windowsContextDefaultValues
);

/**
 * `WindowsProvider` manages open windows, and provides a way to open
 * new windows.
 */
export function WindowsProvider(props: WindowsProviderProps) {
	const { children } = props;

	const {
		state: windows,
		maxZIndex,
		onAddWindow,
		onCloseWindow,
		setIsMinimized,
		setIsMaximazed,
		updateWindowPosition,
		snapWindowToLayout,
		focusWindow,
	} = useWindowsReducer();

	const [focusedWindow, setFocusedWindow] = useState<{
		process: Process;
		id: number;
		zIndex: number;
	} | null>(null);



	const handleCloseWindow = useCallback(
		(processName: Process, id: number): MouseEventHandler =>
			() => {
				onCloseWindow(processName, id);
			},
		[onCloseWindow]
	);

	const handleToggleMaximizeWindow = useCallback(
		(processName: Process, id: number): MouseEventHandler =>
			() => {
				setIsMaximazed((isMaximized) => !isMaximized)(
					processName,
					id
				);
			},
		[setIsMaximazed]
	);

	const handleMinimizeWindow = useCallback(
		(processName: Process, id: number): MouseEventHandler =>
			() => {
				setIsMinimized(true)(processName, id);
			},
		[setIsMinimized]
	);

	const focusWindowCallback = useCallback(
		(processName: Process, id: number) => {
			setFocusedWindow({
				process: processName,
				id,
				zIndex: maxZIndex,
			});
			focusWindow(processName, id);
		},
		[maxZIndex, focusWindow]
	);

	const handleFocusWindow = useCallback(
		(process: Process, id: number) => () => {
			focusWindowCallback(process, id);
		},
		[focusWindowCallback]
	);

	// Handle snap layout selection from WindowContainer
	const handleSnapLayout = useCallback((processName: Process, id: number, layout: SnapLayoutType) => {
		// Calculate position based on layout
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const taskbarHeight = 48;
		
		let position: WindowPosition;
		
		switch (layout) {
			case 'left':
				position = { x: 0, y: 0, width: viewportWidth / 2, height: viewportHeight - taskbarHeight };
				break;
			case 'right':
				position = { x: viewportWidth / 2, y: 0, width: viewportWidth / 2, height: viewportHeight - taskbarHeight };
				break;
			case 'top-left':
				position = { x: 0, y: 0, width: viewportWidth / 2, height: (viewportHeight - taskbarHeight) / 2 };
				break;
			case 'top-right':
				position = { x: viewportWidth / 2, y: 0, width: viewportWidth / 2, height: (viewportHeight - taskbarHeight) / 2 };
				break;
			case 'bottom-left':
				position = { x: 0, y: (viewportHeight - taskbarHeight) / 2, width: viewportWidth / 2, height: (viewportHeight - taskbarHeight) / 2 };
				break;
			case 'bottom-right':
				position = { x: viewportWidth / 2, y: (viewportHeight - taskbarHeight) / 2, width: viewportWidth / 2, height: (viewportHeight - taskbarHeight) / 2 };
				break;
			default:
				position = { x: 0, y: 0, width: viewportWidth, height: viewportHeight - taskbarHeight };
		}
		
		snapWindowToLayout(processName, id, layout, position);
	}, [snapWindowToLayout]);

	/**
	 * Initial position is the center of the `main` element. The `y`
	 * value is negative because the Portal is appended to the end of
	 * the `body` element. The values also need to be offset by half the
	 * width/height of the window being created.
	 */
	const getInitialPosition = useCallback((appPreference: App) => {
		const viewportHeight = window.innerHeight;
		const viewportWidth = window.innerWidth;
		let width = appPreference.initialSize?.width ?? 600;
		let height = appPreference.initialSize?.height ?? 600;

		if (height > viewportHeight) height = viewportHeight - 100;
		if (width > viewportWidth) width = viewportWidth;

		const x = viewportWidth / 2 - width / 2;
		const y = (viewportHeight - 50) / 2 - height / 2;

		return {
			width,
			height,
			x,
			y,
		};
	}, []);

	const value: WindowsContextType = useMemo(
		() => ({
			windows,
			focusedWindow,
			maxZIndex,
			addWindow: onAddWindow,
			closeWindow: onCloseWindow,
			focusWindow: focusWindowCallback,
			updateWindowPosition,
			snapWindow: snapWindowToLayout,
			minimize: {
				on: setIsMinimized(true),
				off: setIsMinimized(false),
			},
		}),
		[
			windows,
			focusedWindow,
			maxZIndex,
			onAddWindow,
			onCloseWindow,
			focusWindowCallback,
			setIsMinimized,
			updateWindowPosition,
			snapWindowToLayout,
		]
	);

	console.groupCollapsed('Windows Provider');
	console.log('Open windows:', windows);
	console.groupEnd();

	return (
		<WindowsContext.Provider value={value}>
			<Portal appendToParentPortal={false}>
				<Box
					left="env(safe-area-inset-left, 0)"
					position="absolute"
					top="env(safe-area-inset-top, 0)"
				>
					<AnimatePresence mode="popLayout">
						{getEntries(windows).flatMap(
							([process, processWindows]) =>
								getEntries(processWindows).flatMap(([id, app]) => (
									<WindowContainer
										icon={app.icon}
										initialPosition={getInitialPosition(app)}
										isFocused={focusedWindow?.id === id}
										isMaximized={app.isMaximized}
										isMinimized={app.isMinimized}
										key={`${process}-${id}`}
										onClose={handleCloseWindow(process as Process, id)}
										onFocus={handleFocusWindow(process as Process, id)}
										onMaximize={handleToggleMaximizeWindow(
											process as Process,
											id
										)}
										onMinimize={handleMinimizeWindow(process as Process, id)}
										onSnapLayout={(layout) => handleSnapLayout(process as Process, id, layout)}
										title={app.fullName}
										windowId={`${process}-${id}`}
										zIndex={app.zIndex ?? 1}
									>
										{app.Window ? (
											<app.Window />
										) : (
											<Center
												draggable={false}
												h="full"
												pointerEvents="none"
												unselectable="on"
												userSelect="none"
											>
												{app.icon}
											</Center>
										)}
									</WindowContainer>
								))
						)}
					</AnimatePresence>
				</Box>
			</Portal>

			{children}
		</WindowsContext.Provider>
	);
}

/** `useWindows` */
export function useWindows() {
	const context = useContext(WindowsContext);

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- context can be undefined if not used within a provider
	if (!context) {
		throw new Error(
			'useWindows must be used within a `WindowsProvider`'
		);
	}

	return context;
}
