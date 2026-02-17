'use client';

import { useCallback, useEffect, useState, useRef } from 'react';

interface FullscreenState {
	isFullscreen: boolean;
	isSupported: boolean;
}

interface UseFullscreenReturn extends FullscreenState {
	toggleFullscreen: () => Promise<void>;
	enterFullscreen: () => Promise<void>;
	exitFullscreen: () => Promise<void>;
}

const isClient = typeof window !== 'undefined';

/**
 * Hook to manage browser fullscreen functionality
 * Handles F11 key binding, ESC key to exit, and provides fullscreen state
 */
export function useFullscreen(): UseFullscreenReturn {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isSupported, setIsSupported] = useState(false);
	const isTogglingRef = useRef(false);

	// Check if fullscreen is supported
	useEffect(() => {
		if (!isClient) return;
		setIsSupported(
			document.fullscreenEnabled ??
			// @ts-expect-error - vendor prefixes for older browsers
			(document.webkitFullscreenEnabled ?? false) ??
			// @ts-expect-error - vendor prefixes for older browsers
			(document.mozFullScreenEnabled ?? false) ??
			// @ts-expect-error - vendor prefixes for older browsers
			(document.msFullscreenEnabled ?? false)
		);
	}, []);

	// Update fullscreen state when it changes
	const handleFullscreenChange = useCallback(() => {
		if (!isClient) return;
		const fullscreenElement = 
			document.fullscreenElement ??
			// @ts-expect-error - vendor prefixes
			(document.webkitFullscreenElement ?? null) ??
			// @ts-expect-error - vendor prefixes
			(document.mozFullScreenElement ?? null) ??
			// @ts-expect-error - vendor prefixes
			(document.msFullscreenElement ?? null);
		setIsFullscreen(!!fullscreenElement);
		isTogglingRef.current = false;
	}, []);

	// Listen for fullscreen changes
	useEffect(() => {
		if (!isClient) return;
		
		const events = [
			'fullscreenchange',
			'webkitfullscreenchange',
			'mozfullscreenchange',
			'MSFullscreenChange'
		];
		
		events.forEach(event => {
			document.addEventListener(event, handleFullscreenChange);
		});
		
		return () => {
			events.forEach(event => {
				document.removeEventListener(event, handleFullscreenChange);
			});
		};
	}, [handleFullscreenChange]);

	// Handle F11 key to toggle fullscreen
	useEffect(() => {
		if (!isClient) return;
		
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'F11') {
				event.preventDefault();
				if (!isTogglingRef.current) {
					isTogglingRef.current = true;
					void toggleFullscreen();
				}
			}
			if (event.key === 'Escape' && isFullscreen) {
				// Browser native ESC handling will exit fullscreen
				// Just update state to match
				setTimeout(handleFullscreenChange, 100);
			}
		};
		
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isFullscreen, handleFullscreenChange]);

	const enterFullscreen = useCallback(async () => {
		if (!isClient || !document.documentElement) return;

		try {
			const docEl = document.documentElement;

			if (docEl.requestFullscreen) {
				await docEl.requestFullscreen();
			}
			// @ts-expect-error - vendor prefixes for older browsers
			else if (docEl.webkitRequestFullscreen) {
				// @ts-expect-error - vendor prefixes for older browsers
				await docEl.webkitRequestFullscreen();
			}
			// @ts-expect-error - vendor prefixes for older browsers
			else if (docEl.mozRequestFullScreen) {
				// @ts-expect-error - vendor prefixes for older browsers
				await docEl.mozRequestFullScreen();
			}
			// @ts-expect-error - vendor prefixes for older browsers
			else if (docEl.msRequestFullscreen) {
				// @ts-expect-error - vendor prefixes for older browsers
				await docEl.msRequestFullscreen();
			}
		} catch (error) {
			console.error('Error entering fullscreen:', error);
			isTogglingRef.current = false;
		}
	}, []);

	const exitFullscreen = useCallback(async () => {
		if (!isClient) return;

		try {
			if (document.exitFullscreen) {
				await document.exitFullscreen();
			}
			// @ts-expect-error - vendor prefixes for older browsers
			else if (document.webkitExitFullscreen) {
				// @ts-expect-error - vendor prefixes for older browsers
				await document.webkitExitFullscreen();
			}
			// @ts-expect-error - vendor prefixes for older browsers
			else if (document.mozCancelFullScreen) {
				// @ts-expect-error - vendor prefixes for older browsers
				await document.mozCancelFullScreen();
			}
			// @ts-expect-error - vendor prefixes for older browsers
			else if (document.msExitFullscreen) {
				// @ts-expect-error - vendor prefixes for older browsers
				await document.msExitFullscreen();
			}
		} catch (error) {
			console.error('Error exiting fullscreen:', error);
			isTogglingRef.current = false;
		}
	}, []);

	const toggleFullscreen = useCallback(async () => {
		if (isFullscreen) {
			await exitFullscreen();
		} else {
			await enterFullscreen();
		}
	}, [isFullscreen, enterFullscreen, exitFullscreen]);

	return {
		isFullscreen,
		isSupported,
		toggleFullscreen,
		enterFullscreen,
		exitFullscreen,
	};
}
