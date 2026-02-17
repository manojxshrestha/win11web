'use client';

import {
	Box,
	IconButton,
	Tooltip,
	useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

import { TaskView } from '@/components/TaskView';
import { useDisclosure } from '@chakra-ui/react';
import TaskViewIconDark from '@/public/icons/TaskView_Dark.png';
import TaskViewIconLight from '@/public/icons/TaskView_Light.png';
import { ThemeImage } from '@repo/ui/components';

const MotionIconButton = motion(IconButton);

export function TaskViewButton() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const iconColor = useColorModeValue('gray.700', 'gray.200');

	const handleToggle = useCallback(() => {
		if (isOpen) {
			onClose();
		} else {
			onOpen();
		}
	}, [isOpen, onOpen, onClose]);

	return (
		<>
			<Tooltip label="Task View" openDelay={1000}>
				<MotionIconButton
					aria-label="Task View"
					size="sm"
					variant="ghost"
					_hover={{ background: 'hoverBg' }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={{
						type: 'spring',
						stiffness: 400,
						damping: 17,
					}}
					onClick={handleToggle}
					icon={
						<Box boxSize="20px" position="relative">
							<ThemeImage
								alt="Task View"
								srcDark={TaskViewIconDark}
								srcLight={TaskViewIconLight}
								fill
							/>
						</Box>
					}
				/>
			</Tooltip>

			{isOpen && <TaskView onClose={onClose} />}
		</>
	);
}

export default TaskViewButton;
