import { type Props } from 'react-rnd';

import type { WindowPosition, WindowsContext } from './Windows';

export const windowsContextDefaultValues: WindowsContext = {
	windows: {} as WindowsContext['windows'],
	focusedWindow: null,
	maxZIndex: 1,
	addWindow: () => undefined,
	closeWindow: () => undefined,
	focusWindow: () => undefined,
	updateWindowPosition: () => undefined,
	snapWindow: () => undefined,
	minimize: {
		on: () => undefined,
		off: () => undefined,
	},
};

export const initialWindowPosition: Props['default'] = {
	x: 300,
	y: -800,
	width: 800,
	height: 'auto',
};
