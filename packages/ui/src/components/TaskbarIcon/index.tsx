"use client";

import type { IconButtonProps } from '@chakra-ui/react';
import {
	Center,
	forwardRef,
	IconButton,
	Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

// type TaskbarIconProps = AppIconProps;

type TaskbarIconProps = Omit<IconButtonProps, 'aria-label' | 'icon'> & {
	app: {
		shortName: string;
		icon: React.ReactNode;
	};
};

// Enhanced motion IconButton
const MotionIconButton = motion(IconButton);

function TaskbarIconInner(
	props: TaskbarIconProps,
	ref: React.ForwardedRef<HTMLButtonElement>
) {
	const { app, ...rest } = props;

	return (
		<Tooltip label={app.shortName} openDelay={1000}>
			<MotionIconButton
				_light={{
					_hover: {
						bg: 'hoverBg',
					},
				}}
				aria-label={app.shortName}
				borderRadius="md"
				icon={<Center w="24px">{app.icon}</Center>}
				ref={ref}
				size="md"
				variant="ghost"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				transition={{
					type: 'spring',
					stiffness: 400,
					damping: 17,
				}}
				{...rest}
			/>
		</Tooltip>
	);
}

export const TaskbarIcon = forwardRef(TaskbarIconInner) as (
	props: TaskbarIconProps & {
		ref?: React.ForwardedRef<HTMLButtonElement>;
	}
) => ReturnType<typeof TaskbarIconInner>;
