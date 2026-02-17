import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { Providers } from './providers';
import { RecycleBinProvider } from '@/contexts/RecycleBinContext';

const segoe = localFont({
	src: [
		{
			path: './fonts/SegoeUI-VF/SegoeUI-VF.woff2',
			style: 'normal',
			weight: '100 900',
		},
		{
			path: './fonts/SegoeUI-VF/SegoeUI-VF.woff2',
			style: 'italic',
			weight: '100 900',
		},
	],
	display: 'swap',
	variable: '--body-font',
	preload: true,
});

export const metadata: Metadata = {
	metadataBase: new URL('https://windows-web.vercel.app'),
	title: 'Windows 11 Web',
	description: `Discover the elegance of Windows 11 in your browser! Powered by Next.js and Chakra UI, this open source project replicates the stylish design and smooth user interface of the real Windows 11. Explore familiar features and play around with the settings - all in your browser.`,
	applicationName: 'Windows 11 Web',
	generator: 'Next.js',
	creator: 'https://github.com/EduardoPicolo/Windows-11-web',
	publisher: 'Windows 11 Web',
	keywords: [
		'nextjs',
		'react',
		'typescript',
		'chakra-ui',
		'Windows',
		'Windows 11',
		'Windows Web',
		'web development',
		'UI design',
		'clone',
		'Microsoft',
	],
	robots: 'index, follow',
	openGraph: {
		type: 'website',
		url: 'https://windows-web.vercel.app',
		title: 'Windows 11 Web',
		siteName: 'Windows 11 Web',
		description: `Discover the elegance of Windows 11 in your browser! Powered by Next.js and Chakra UI, this open source project replicates the stylish design and smooth user interface of the real Windows 11. Explore familiar features and play around with the settings - all in your browser.`,
	},
	verification: {
		google: process.env.GOOGLE_VERIFICATION,
	},
	alternates: {
		canonical: 'https://windows-web.vercel.app',
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html className={`${segoe.variable}`} lang="en">
			<head>
				<style>{
					`
					/* xterm.js styles */
					.xterm { position: relative; user-select: none; user-select: none; }
					.xterm.focus, .xterm:focus { outline: none; }
					.xterm .xterm-helpers { position: absolute; top: 0; left: 0; z-index: 10; }
					.xterm .xterm-helper-textarea { position: absolute; opacity: 0; overflow: hidden; left: 0; top: 0; width: 1px; height: 1px; padding: 0; border: 0; outline: none; resize: none; white-space: nowrap; }
					.xterm .xterm-viewport { overflow-y: scroll; right: 0; bottom: 0; left: 0; width: auto !important; height: auto !important; }
					.xterm .xterm-screen { position: relative; }
					.xterm .xterm-screen canvas { width: 100%; height: 100%; display: block; }
					.xterm .xterm-scroll-area { visibility: hidden; }
					.xterm .xterm-decoding-bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: inherit; z-index: 20; }
					.xterm-char-measure-element { display: inline-block; visibility: hidden; position: absolute; left: -9999em; line-height: normal; }

					/* Desktop Icon Drag Styles */
					.desktop-icon {
						transition: opacity 0.15s ease, box-shadow 0.15s ease;
					}
					.desktop-icon.dragging {
						opacity: 0.85 !important;
						box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
						filter: brightness(1.1);
						transform: scale(1.02);
					}
					.desktop-icon:active {
						cursor: grabbing !important;
					}
					`}
				</style>
			</head>
			<body>
				{/* eslint-disable-next-line @next/next/no-sync-scripts -- must not defer/async */}
				<script
					data-project-id="9mYUaURtWAbjQsLEkcgfdMrwoQ77zxbG0arEEQub"
					src="https://snippet.meticulous.ai/v1/meticulous.js"
				/>
				<Providers>
					<RecycleBinProvider>{children}</RecycleBinProvider>
				</Providers>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
