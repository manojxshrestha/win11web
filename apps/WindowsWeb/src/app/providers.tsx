'use client';

import 'react-toastify/dist/ReactToastify.min.css';

import { CacheProvider } from '@chakra-ui/next-js';
import type { Theme } from '@chakra-ui/react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { CustomToastContainer } from '@repo/ui/components';
import { theme } from '@repo/ui/theme';
import type { ReactNode } from 'react';

import { RecycleBinProvider } from '@/contexts/RecycleBinContext';
import { SystemProvider } from '@/contexts/System';
import { WindowsProvider } from '@/contexts/Windows';

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<>
			<CacheProvider>
				<ChakraProvider theme={theme}>
					<RecycleBinProvider>
						<SystemProvider>
							<WindowsProvider>{children}</WindowsProvider>
						</SystemProvider>
					</RecycleBinProvider>
					<CustomToastContainer />
				</ChakraProvider>
			</CacheProvider>
			<ColorModeScript
				initialColorMode={(theme as Theme).config.initialColorMode}
			/>
		</>
	);
}
