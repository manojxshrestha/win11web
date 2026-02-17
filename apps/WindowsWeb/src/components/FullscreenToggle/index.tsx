'use client';

import { Box, Tooltip } from '@chakra-ui/react';
import { useFullscreen } from '@/hooks/useFullscreen';

export function FullscreenToggle() {
	const { isFullscreen, toggleFullscreen } = useFullscreen();

	// Don't show when in fullscreen mode (hidden as requested)
	if (isFullscreen) return null;

	return (
		<Box
			position="fixed"
			top="16px"
			right="16px"
			zIndex={9999}
		>
			<Tooltip 
				label="Enter Fullscreen (F11)" 
				placement="bottom"
			>
				<Box
					bg="rgba(0, 0, 0, 0.5)"
					color="white"
					width="32px"
					height="32px"
					borderRadius="md"
					display="flex"
					alignItems="center"
					justifyContent="center"
					cursor="pointer"
					onClick={toggleFullscreen}
					_hover={{ 
						bg: "rgba(0, 0, 0, 0.7)",
						transform: "scale(1.1)"
					}}
					transition="all 0.15s ease"
					boxShadow="0 2px 8px rgba(0, 0, 0, 0.3)"
					title="Enter Fullscreen"
				>
					{/* YouTube-style fullscreen arrows icon - pointing outward */}
					<Box
						as="svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
					</Box>
				</Box>
			</Tooltip>
		</Box>
	);
}

export default FullscreenToggle;
