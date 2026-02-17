"use client";

import { useRef } from 'react';
import type { MenuProps } from '@chakra-ui/react';
import { Box, Menu, Portal } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { useEventListener } from '@/hooks/useEventListener';

export type ContextMenuProps = MenuProps & {
	position: {
		x: number | string;
		y: number | string;
	};
};

// Animation variants for context menu
const menuVariants = {
	hidden: {
		opacity: 0,
		scale: 0.95,
		y: -10,
	},
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			type: 'spring',
			stiffness: 300,
			damping: 25,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		y: -10,
		transition: {
			duration: 0.15,
		},
	},
};

export function ContextMenu(props: ContextMenuProps) {
	const { position, children, ...rest } = props;

	const menuRef = useRef<HTMLDivElement>(null);

	useEventListener('click', (event) => {
		if (
			menuRef.current &&
			menuRef.current.contains(event.target as Node)
		) {
			console.log('Clicked inside menu, not closing.');

			return;
		}

		rest.onClose?.();
	});

	return (
		<Portal appendToParentPortal={false}>
			<AnimatePresence>
				{rest.isOpen && (
					<motion.div
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={menuVariants}
						style={{
							position: 'absolute',
							left: position.x,
							top: position.y,
							zIndex: 1000,
						}}
					>
						<Box
							ref={menuRef}
						>
							<Menu
								computePositionOnMount
								size="sm"
								/**
								 * Fix menu closing on auxclick. It should only reposition
								 * itself.
								 */
								closeOnBlur={false}
								{...rest}
							>
								{(internalProps) =>
									typeof children === 'function'
										? children(internalProps)
										: children
								}
							</Menu>
						</Box>
					</motion.div>
				)}
			</AnimatePresence>
		</Portal>
	);
}
