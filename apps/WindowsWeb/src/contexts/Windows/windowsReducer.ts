import type { Windows, WindowsActions } from './Windows';
import {
	addWindow,
	closeWindow,
	focusWindow,
	maximizeWindow,
	minimizeWindow,
	snapWindow,
	updatePosition,
} from '@/contexts/Windows/actions';

export function windowReducer(
	state: Windows,
	action: WindowsActions
) {
	switch (action.type) {
		case 'ADD_WINDOW': {
			return addWindow(state, action);
		}

		case 'CLOSE_WINDOW': {
			return closeWindow(state, action);
		}

		case 'MINIMIZE_WINDOW': {
			return minimizeWindow(state, action);
		}

		case 'MAXIMIZE_WINDOW': {
			return maximizeWindow(state, action);
		}

		case 'UPDATE_POSITION': {
			return updatePosition(state, action);
		}

		case 'SNAP_WINDOW': {
			return snapWindow(state, action);
		}

		case 'FOCUS_WINDOW': {
			return focusWindow(state, action);
		}

		default: {
			return state;
		}
	}
}
