import type { SystemContext } from './System';
import WindowsWallpaper from '@/public/wallpapers/1-win11.jpg';

type WallpaperFitStyle = 'cover' | 'contain' | 'fill' | 'scale-down';

// Default accent colors
export const accentColors = [
  { name: 'Blue', value: '#0078d4' },
  { name: 'Green', value: '#107c10' },
  { name: 'Pink', value: '#e3008c' },
  { name: 'Purple', value: '#8764b8' },
  { name: 'Red', value: '#d13438' },
  { name: 'Teal', value: '#008272' },
  { name: 'Orange', value: '#ff8c00' },
  { name: 'Gray', value: '#767676' },
];

export const systemContextDefaultValues: SystemContext = {
	sound: [33, () => undefined],
	soundMuted: [
		false,
		{
			on: () => undefined,
			off: () => undefined,
			toggle: () => undefined,
		},
	],
	brightness: [100, () => undefined],
	wallpaper: [WindowsWallpaper, () => undefined],
	wallpaperFit: ['cover' as WallpaperFitStyle, () => undefined],
	accentColor: [accentColors[0]!.value, () => undefined],
	theme: ['dark' as 'light' | 'dark', () => undefined],
	showDesktopIcons: [
		true,
		{
			on: () => undefined,
			off: () => undefined,
			toggle: () => undefined,
		},
	],
};

export const wallpaperFitOptions: WallpaperFitStyle[] = [
	'fill',
	'contain',
	'cover',
	'scale-down',
];

export type { WallpaperFitStyle };
