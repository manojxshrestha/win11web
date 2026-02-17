'use client';

import { useBoolean } from '@chakra-ui/react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import DefaultWallpaper from '@/public/wallpapers/1-win11.jpg';

import { systemContextDefaultValues } from './helpers';
import type { SystemContext, Wallpaper, WallpaperFitStyle } from './System';

// Default accent colors
const ACCENT_COLORS = [
  { name: 'Blue', value: '#0078d4' },
  { name: 'Green', value: '#107c10' },
  { name: 'Pink', value: '#e3008c' },
  { name: 'Purple', value: '#8764b8' },
  { name: 'Red', value: '#d13438' },
  { name: 'Teal', value: '#008272' },
  { name: 'Orange', value: '#ff8c00' },
  { name: 'Gray', value: '#767676' },
];

export const accentColors = ACCENT_COLORS;

const STORAGE_KEY = 'windows11_system_settings';

const SystemContext = createContext<SystemContext>(
	systemContextDefaultValues
);

/**
 * `SystemProvider` manages system configuration (audio, brightness,
 * wallpaper)
 */
export function SystemProvider(props: { children: React.ReactNode }) {
	const { children } = props;

	// Load initial state from localStorage
	const loadStoredSettings = () => {
		if (typeof window === 'undefined') return null;
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				return JSON.parse(stored);
			}
		} catch {
			console.warn('Failed to load system settings from localStorage');
		}
		return null;
	};

	const storedSettings = loadStoredSettings();

	const sound = useState(storedSettings?.sound ?? 30);
	const soundMuted = useBoolean(storedSettings?.soundMuted ?? false);
	const brightness = useState(storedSettings?.brightness ?? 100);

	const wallpaper = useState<Wallpaper>(storedSettings?.wallpaper ?? DefaultWallpaper);
	const wallpaperFit = useState<WallpaperFitStyle>(storedSettings?.wallpaperFit ?? 'cover');
	const accentColor = useState<string>(storedSettings?.accentColor ?? ACCENT_COLORS[0]!.value);
	const theme = useState<'light' | 'dark'>(storedSettings?.theme ?? 'dark');
	const showDesktopIcons = useBoolean(storedSettings?.showDesktopIcons ?? true);

	// Persist settings to localStorage
	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const settingsToStore = {
			sound: sound[0],
			soundMuted: soundMuted[0],
			brightness: brightness[0],
			wallpaper: wallpaper[0],
			wallpaperFit: wallpaperFit[0],
			accentColor: accentColor[0],
			theme: theme[0],
			showDesktopIcons: showDesktopIcons[0],
		};
		
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToStore));
		} catch {
			console.warn('Failed to save system settings to localStorage');
		}
	}, [sound[0], soundMuted[0], brightness[0], wallpaper[0], wallpaperFit[0], accentColor[0], theme[0], showDesktopIcons[0]]);

	console.groupCollapsed('System Provider');
	console.log('sound', sound);
	console.log('brightness', brightness);
	console.groupEnd();

	const value: SystemContext = useMemo(
		() => ({
			sound,
			soundMuted,
			brightness,
			wallpaper,
			wallpaperFit,
			accentColor,
			theme,
			showDesktopIcons,
		}),
		[brightness, sound, soundMuted, wallpaper, wallpaperFit, accentColor, theme, showDesktopIcons]
	);

	return (
		<SystemContext.Provider value={value}>
			{children}
		</SystemContext.Provider>
	);
}

/** `useSystem` */
export function useSystem() {
	const context = useContext(SystemContext);

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- context can be undefined if not used within a provider
	if (!context) {
		throw new Error(
			'useSystem must be used within a `SystemProvider`'
		);
	}

	return context;
}
