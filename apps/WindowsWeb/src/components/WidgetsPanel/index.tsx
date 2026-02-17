'use client';

import {
	Box,
	Button,
	Divider,
	Flex,
	Grid,
	Heading,
	HStack,
	Icon,
	IconButton,
	Input,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	SimpleGrid,
	Text,
	VStack,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiClock, FiSun, FiThermometer, FiTrendingUp, FiWind } from 'react-icons/fi';

// Animation variants for Widgets panel
const panelVariants = {
	hidden: {
		opacity: 0,
		y: -10,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 300,
			damping: 25,
		},
	},
	exit: {
		opacity: 0,
		y: -10,
		scale: 0.95,
		transition: {
			duration: 0.15,
		},
	},
};

const widgetVariants = {
	hidden: {
		opacity: 0,
		scale: 0.9,
	},
	visible: (i: number) => ({
		opacity: 1,
		scale: 1,
		transition: {
			delay: i * 0.1,
			type: 'spring',
			stiffness: 300,
			damping: 25,
		},
	}),
};

interface Widget {
	id: string;
	title: string;
	icon: React.ReactNode;
}

// Weather Widget Component
function WeatherWidget() {
	const weatherBg = useColorModeValue('blue.50', 'gray.700');
	const tempColor = useColorModeValue('blue.600', 'blue.300');

	return (
		<Box bg={weatherBg} p={4} borderRadius="xl">
			<HStack justify="space-between" mb={2}>
				<HStack>
					<Icon as={FiSun} boxSize={5} color={tempColor} />
					<Text fontSize="sm" fontWeight="medium">
						Weather
					</Text>
				</HStack>
				<Text fontSize="xs" color="gray.500">
					Kathmandu
				</Text>
			</HStack>
			<HStack justify="space-between" align="baseline">
				<Text fontSize="4xl" fontWeight="bold" color={tempColor}>
					18°
				</Text>
				<VStack align="start" spacing={0}>
					<Text fontSize="sm" color="gray.600">
						Partly Cloudy
					</Text>
					<Text fontSize="xs" color="gray.500">
						H:22° L:12°
					</Text>
				</VStack>
			</HStack>
			<HStack mt={3} spacing={4}>
				<HStack spacing={1}>
					<Icon as={FiWind} boxSize={3} color="gray.500" />
					<Text fontSize="xs" color="gray.500">
						5 km/h
					</Text>
				</HStack>
				<HStack spacing={1}>
					<Icon as={FiThermometer} boxSize={3} color="gray.500" />
					<Text fontSize="xs" color="gray.500">
						65%
					</Text>
				</HStack>
			</HStack>
		</Box>
	);
}


// Stocks Widget Component
function StocksWidget() {
	const stocksBg = useColorModeValue('green.50', 'green.900');
	const positiveColor = useColorModeValue('green.600', 'green.300');

	const stocks = [
		{ symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.34 },
		{ symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: -1.23 },
		{ symbol: 'GOOGL', name: 'Alphabet', price: 141.80, change: 3.45 },
	];

	return (
		<Box bg={stocksBg} p={4} borderRadius="xl">
			<HStack justify="space-between" mb={3}>
				<HStack>
					<Icon as={FiTrendingUp} boxSize={5} color={positiveColor} />
					<Text fontSize="sm" fontWeight="medium">
						Stocks
					</Text>
				</HStack>
			</HStack>
			<VStack spacing={2} align="stretch">
				{stocks.map((stock) => (
					<HStack key={stock.symbol} justify="space-between">
						<VStack align="start" spacing={0}>
							<Text fontSize="sm" fontWeight="medium">
								{stock.symbol}
							</Text>
							<Text fontSize="xs" color="gray.500" noOfLines={1}>
								{stock.name}
							</Text>
						</VStack>
						<VStack align="end" spacing={0}>
							<Text fontSize="sm" fontWeight="medium">
								${stock.price.toFixed(2)}
							</Text>
							<Text
								fontSize="xs"
								color={stock.change >= 0 ? positiveColor : 'red.500'}
							>
								{stock.change >= 0 ? '+' : ''}
								{stock.change}%
							</Text>
						</VStack>
					</HStack>
				))}
			</VStack>
		</Box>
	);
}

// Widgets Panel Component
export function WidgetsPanel() {
	const panelBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	const widgetsDisclosure = useDisclosure();

	return (
		<Popover
			gutter={16}
			offset={[-200, 16]}
			placement="top-start"
			{...widgetsDisclosure}
		>
			<PopoverTrigger>
				<IconButton
					aria-label="Widgets"
					size="sm"
					variant="ghost"
					_hover={{ background: 'hoverBg' }}
				>
					<Box
						w="20px"
						h="20px"
						borderRadius="sm"
						bgGradient="linear(to-br, blue.400, purple.500, pink.400)"
					/>
				</IconButton>
			</PopoverTrigger>
			<AnimatePresence>
				{widgetsDisclosure.isOpen && (
					<motion.div
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={panelVariants}
					>
					<PopoverContent
						w="400px"
						bg={panelBg}
						borderColor={borderColor}
					>
						<PopoverBody p={4}>
							<VStack spacing={4} align="stretch">
								{/* Search Bar */}
								<Input
									placeholder="Search widgets"
									size="sm"
									borderRadius="full"
								/>

								{/* Widgets Grid */}
								<Grid templateColumns="repeat(2, 1fr)" gap={3}>
									<motion.div custom={0} variants={widgetVariants}>
										<WeatherWidget />
									</motion.div>
									<motion.div custom={1} variants={widgetVariants}>
										<StocksWidget />
									</motion.div>
								</Grid>

								{/* Quick Actions */}
								<Divider />
								<SimpleGrid columns={3} spacing={2}>
									<VStack
										spacing={1}
										p={2}
										borderRadius="md"
										_hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
										cursor="pointer"
									>
										<Icon as={FiSun} boxSize={5} color="yellow.500" />
										<Text fontSize="xs">Weather</Text>
									</VStack>
									<VStack
										spacing={1}
										p={2}
										borderRadius="md"
										_hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
										cursor="pointer"
									>
										<Icon as={FiTrendingUp} boxSize={5} color="green.500" />
										<Text fontSize="xs">Stocks</Text>
									</VStack>
									<VStack
										spacing={1}
										p={2}
										borderRadius="md"
										_hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
										cursor="pointer"
									>
										<Icon as={FiClock} boxSize={5} color="gray.500" />
										<Text fontSize="xs">Clock</Text>
									</VStack>
								</SimpleGrid>
							</VStack>
						</PopoverBody>
					</PopoverContent>
					</motion.div>
				)}
			</AnimatePresence>
		</Popover>
	);
}

export default WidgetsPanel;
