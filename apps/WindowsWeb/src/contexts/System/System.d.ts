type Wallpaper = import('next/image').ImageProps['src'];

type WallpaperFitStyle = 'cover' | 'contain' | 'fill' | 'scale-down';

interface SystemContext {
	sound: [number, React.Dispatch<React.SetStateAction<number>>];
	soundMuted: readonly [
		boolean,
		{
			on: () => void;
			off: () => void;
			toggle: () => void;
		},
	];
	brightness: [number, React.Dispatch<React.SetStateAction<number>>];
	wallpaper: [
		Wallpaper,
		React.Dispatch<React.SetStateAction<Wallpaper>>,
	];
	wallpaperFit: [
		WallpaperFitStyle,
		React.Dispatch<React.SetStateAction<WallpaperFitStyle>>,
	];
	accentColor: [string, React.Dispatch<React.SetStateAction<string>>];
	theme: ['light' | 'dark', React.Dispatch<React.SetStateAction<'light' | 'dark'>>];
	showDesktopIcons: readonly [
		boolean,
		{
			on: () => void;
			off: () => void;
			toggle: () => void;
		},
	];
}

export type { SystemContext, Wallpaper, WallpaperFitStyle };

export interface AccentColor {
	name: string;
	value: string;
}
