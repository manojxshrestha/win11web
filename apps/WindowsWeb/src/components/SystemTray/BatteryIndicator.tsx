'use client';

import {
	Box,
	Flex,
	HStack,
	Icon,
	Text,
	Tooltip,
	useColorModeValue,
} from '@chakra-ui/react';
import { IoBatteryCharging } from 'react-icons/io5';
import { TbBattery4 } from 'react-icons/tb';

export function BatteryIndicator({ level = 85, isCharging = false }: { level?: number; isCharging?: boolean }) {
	const batteryColor = useColorModeValue('gray.800', 'white');
	const lowBattery = level < 20;
	const mediumBattery = level < 50;

	const fillColor = isCharging
		? 'green.500'
		: lowBattery
			? 'red.500'
			: mediumBattery
				? 'orange.500'
				: 'green.500';

	return (
		<Tooltip
			gutter={20}
			label={`Battery: ${level}%${isCharging ? ' (Charging)' : ''}`}
			openDelay={1000}
		>
			<HStack
				_hover={{
					background: 'hoverBg',
				}}
				as="button"
				borderRadius="md"
				cursor="default"
				px={2}
				py={1}
				transition="all 0.2s"
			>
				<Flex align="center" gap={1}>
					<Box
						position="relative"
						w="28px"
						h="14px"
						border="2px solid"
						borderColor={batteryColor}
						borderRadius="md"
						p="1px"
					>
						<Box
							position="absolute"
							top="50%"
							left="2px"
							transform="translateY(-50%)"
							w={`${Math.max(0, Math.min(100, level * 0.85))}%`}
							h="80%"
							bg={fillColor}
							borderRadius="sm"
						/>
						{isCharging && (
							<Icon
								as={IoBatteryCharging}
								position="absolute"
								top="50%"
								left="50%"
								transform="translate(-50%, -50%)"
								color="white"
								boxSize={3}
							/>
						)}
					</Box>
					<Box
						position="relative"
						w="3px"
						h="8px"
						bg={batteryColor}
						borderRadius="sm"
						mr="2px"
					/>
					<Text fontSize="xs" fontWeight="medium">
						{level}%
					</Text>
				</Flex>
			</HStack>
		</Tooltip>
	);
}

export default BatteryIndicator;
