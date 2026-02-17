import type { Process } from '@/components/Apps/apps';

export interface WindowPosition {
	x: number;
	y: number;
	width: number | string;
	height: number | string;
}

export interface WindowBounds {
	minWidth?: number;
	maxWidth?: number;
	minHeight?: number;
	maxHeight?: number;
}

interface WindowsProviderProps {
	children: React.ReactNode;
}

/**
 * The shape of all running {@link Process}es. The key is the process
 * name, and the value is a Record of the window id and the
 * {@link WindowState}.
 */
export type Windows = Record<Process, Record<number, App & WindowState>>;

export interface WindowsContext {
	windows: Windows;
	focusedWindow: {
		process: Process;
		id: number;
		zIndex: number;
	} | null;
	maxZIndex: number;
	addWindow: (app: App, options?: WindowState) => void;
	closeWindow: (processName: Process, id: number) => void;
	focusWindow: (processName: Process, id: number) => void;
	updateWindowPosition: (processName: Process, id: number, position: WindowPosition) => void;
	snapWindow: (processName: Process, id: number, layout: string, position: WindowPosition) => void;
	minimize: {
		on: (processName: Process, id: number) => void;
		off: (processName: Process, id: number) => void;
	};
}

export interface WindowState {
	isMinimized: boolean;
	isMaximized: boolean;
	position?: WindowPosition;
	previousPosition?: WindowPosition;
	snapLayout?: string;
	zIndex: number;
	anchorEl?: HTMLElement | null;
}

export interface AddWindowAction {
	type: 'ADD_WINDOW';
	payload: {
		app: App;
		options?: Partial<WindowState>;
	};
}

export interface CloseWindowAction {
	type: 'CLOSE_WINDOW';
	payload: {
		processName: Process;
		id: number;
	};
}

export interface MinimizeWindowAction {
	type: 'MINIMIZE_WINDOW';
	payload: {
		processName: Process;
		id: number;
		value: boolean;
	};
}

export interface MaximizeWindowAction {
	type: 'MAXIMIZE_WINDOW';
	payload: {
		processName: Process;
		id: number;
		value: boolean;
	};
}

export interface UpdatePositionAction {
	type: 'UPDATE_POSITION';
	payload: {
		processName: Process;
		id: number;
		position: WindowPosition;
	};
}

export interface SnapWindowAction {
	type: 'SNAP_WINDOW';
	payload: {
		processName: Process;
		id: number;
		layout: string;
		position: WindowPosition;
	};
}

export interface FocusWindowAction {
	type: 'FOCUS_WINDOW';
	payload: {
		processName: Process;
		id: number;
	};
}

export type WindowsActions =
	| AddWindowAction
	| CloseWindowAction
	| MinimizeWindowAction
	| MaximizeWindowAction
	| UpdatePositionAction
	| SnapWindowAction
	| FocusWindowAction;

export type WindowsReducerActionHandler<T extends WindowsActions> = (
	state: Windows,
	action: T
) => Windows;
