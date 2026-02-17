import type {
	AddWindowAction,
	CloseWindowAction,
	FocusWindowAction,
	MaximizeWindowAction,
	MinimizeWindowAction,
	SnapWindowAction,
	UpdatePositionAction,
	Windows,
	WindowsReducerActionHandler,
	WindowPosition,
} from './Windows';

export const addWindow: WindowsReducerActionHandler<
	AddWindowAction
> = (state, action) => {
	const { app, options } = action.payload;

	const process = app.processName;
	const id = Date.now();

	const newWindow = {
		...app,
		isMinimized: options?.isMinimized ?? false,
		isMaximized: options?.isMaximized ?? false,
		zIndex: options?.zIndex ?? 1,
		position: options?.position ?? undefined,
		previousPosition: options?.previousPosition ?? undefined,
		snapLayout: options?.snapLayout ?? undefined,
	};

	return {
		...state,
		[process]: {
			...state[process],
			[id]: newWindow,
		},
	};
};

export const closeWindow: WindowsReducerActionHandler<
	CloseWindowAction
> = (state, action) => {
	const { processName, id } = action.payload;

	console.log('CLOSE_WINDOW:', processName, id);

	if (!state[processName]) {
		return state;
	}

	/**
	 * Remove the window from the windows object and check if there are
	 * any windows left for the Process, if not, remove the executable
	 * from the windows object.
	 */

	// Do not delete dynamically computed property keys.
	const { [id]: _removedWindow, ...remainingWindows } =
		state[processName];

	/** If there are no windows left for the Process, remove the Process. */
	if (Object.keys(remainingWindows).length === 0) {
		const { [processName]: _removedProcess, ...newWindows } = state;

		return {
			...(newWindows as Windows),
		};
	}

	return {
		...state,
		[processName]: remainingWindows,
	};
};

export const minimizeWindow: WindowsReducerActionHandler<
	MinimizeWindowAction
> = (state, action) => {
	const { processName, id, value } = action.payload;

	return {
		...state,
		[processName]: {
			...state[processName],
			[id]: {
				...state[processName][id],
				isMinimized: value,
			},
		},
	};
};

export const maximizeWindow: WindowsReducerActionHandler<
	MaximizeWindowAction
> = (state, action) => {
	const { processName, id, value } = action.payload;

	const currentWindow = state[processName]?.[id];
	if (!currentWindow) return state;

	// Store/restore previous position for maximize/restore
	const newPreviousPosition = value && !currentWindow.isMaximized
		? currentWindow.position
		: currentWindow.previousPosition;

	return {
		...state,
		[processName]: {
			...state[processName],
			[id]: {
				...state[processName][id],
				isMaximized: value,
				previousPosition: newPreviousPosition,
			},
		},
	};
};

export const updatePosition: WindowsReducerActionHandler<
	UpdatePositionAction
> = (state, action) => {
	const { processName, id, position } = action.payload;

	return {
		...state,
		[processName]: {
			...state[processName],
			[id]: {
				...state[processName][id],
				position,
			},
		},
	};
};

export const snapWindow: WindowsReducerActionHandler<
	SnapWindowAction
> = (state, action) => {
	const { processName, id, layout, position } = action.payload;

	return {
		...state,
		[processName]: {
			...state[processName],
			[id]: {
				...state[processName][id],
				snapLayout: layout,
				position,
				isMaximized: true,
			},
		},
	};
};

export const focusWindow: WindowsReducerActionHandler<
	FocusWindowAction
> = (state, action) => {
	const { processName, id } = action.payload;

	const currentWindow = state[processName]?.[id];
	if (!currentWindow) return state;

	// Calculate max z-index across all windows
	let maxZIndex = 1;
	for (const process of Object.values(state)) {
		for (const window of Object.values(process)) {
			if (window.zIndex && window.zIndex > maxZIndex) {
				maxZIndex = window.zIndex;
			}
		}
	}

	return {
		...state,
		[processName]: {
			...state[processName],
			[id]: {
				...state[processName][id],
				zIndex: maxZIndex + 1,
			},
		},
	};
};
