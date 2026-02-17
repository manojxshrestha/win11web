'use client';

import {
	ChatApp,
	EdgeApp,
	FileExplorerApp,
	NotepadApp,
	SettingsApp,
	StoreApp,
	TerminalApp,
} from '@/components/Apps/apps';

export const defaultTaskbarItems: App[] = [
	// TasksApp,
	SettingsApp,
	ChatApp,
	FileExplorerApp,
	NotepadApp,
	TerminalApp,
	EdgeApp,
	StoreApp,
];
