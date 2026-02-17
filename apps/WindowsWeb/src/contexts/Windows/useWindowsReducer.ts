import type { Reducer } from 'react';
import { useCallback, useReducer, useState } from 'react';

import type { Process } from '@/components/Apps/apps';
import type { WindowPosition, WindowState, Windows, WindowsActions } from './Windows';
import { windowReducer } from '@/contexts/Windows/windowsReducer';

interface UseWindowsReducerProps {
	reducer?: Reducer<Windows, WindowsActions>;
	initialState?: Windows;
}

const initialState: Windows = {} as Windows;

/**
 * `useWindowsReducer` is a custom hook for managing the state of
 * Process's windows.
 */
export function useWindowsReducer(props?: UseWindowsReducerProps) {
	const [state, dispatch] = useReducer(
		props?.reducer ?? windowReducer,
		props?.initialState ?? initialState
	);

	// Track max z-index for proper layering
	const [maxZIndex, setMaxZIndex] = useState(1);

	const onAddWindow = useCallback(
		(app: App, options?: Partial<WindowState>) => {
			dispatch({
				type: 'ADD_WINDOW',
				payload: {
					app,
					options,
				},
			});
		},
		[dispatch]
	);

	const onCloseWindow = useCallback(
		(processName: Process, id: number) => {
			dispatch({
				type: 'CLOSE_WINDOW',
				payload: {
					processName,
					id,
				},
			});
		},
		[dispatch]
	);

	const setIsMinimized = useCallback(
		(value: boolean) => (processName: Process, id: number) => {
			dispatch({
				type: 'MINIMIZE_WINDOW',
				payload: {
					processName,
					id,
					value,
				},
			});
		},
		[dispatch]
	);

	const setIsMaximazed = useCallback(
		(value: boolean | ((value: boolean) => boolean)) =>
			(processName: Process, id: number) => {
				let newValue = value;

				if (typeof value === 'function') {
					newValue = value(state[processName]?.[id]?.isMaximized ?? false);
				}

				dispatch({
					type: 'MAXIMIZE_WINDOW',
					payload: {
						processName,
						id,
						value: newValue as boolean,
					},
				});
			},
		[state]
	);

	const updateWindowPosition = useCallback(
		(processName: Process, id: number, position: WindowPosition) => {
			dispatch({
				type: 'UPDATE_POSITION',
				payload: {
					processName,
					id,
					position,
				},
			});
		},
		[dispatch]
	);

	const snapWindowToLayout = useCallback(
		(processName: Process, id: number, layout: string, position: WindowPosition) => {
			dispatch({
				type: 'SNAP_WINDOW',
				payload: {
					processName,
					id,
					layout,
					position,
				},
			});
		},
		[dispatch]
	);

	const focusWindow = useCallback(
		(processName: Process, id: number) => {
			// Update z-index for the focused window
			setMaxZIndex((prev) => {
				const newMax = prev + 1;
				dispatch({
					type: 'FOCUS_WINDOW',
					payload: {
						processName,
						id,
					},
				});
				return newMax;
			});
		},
		[dispatch]
	);

	return {
		state,
		dispatch,
		maxZIndex,
		onAddWindow,
		onCloseWindow,
		setIsMinimized,
		setIsMaximazed,
		updateWindowPosition,
		snapWindowToLayout,
		focusWindow,
	};
}
