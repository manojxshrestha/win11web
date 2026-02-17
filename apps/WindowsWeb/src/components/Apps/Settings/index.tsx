"use client";

import {
	Box,
	Button,
	ButtonGroup,
	Grid,
	GridItem,
	Heading,
	HStack,
	Icon,
	Input,
	InputGroup,
	InputRightElement,
	SkeletonCircle,
	Stack,
	type StackProps,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useTabsContext,
} from '@chakra-ui/react';
import { useState, useMemo, useCallback } from 'react';
import { IoSearch } from 'react-icons/io5';

import { settingsItems, type SettingsItem } from '@/components/Apps/Settings/settingsItems';

type SettingsSidebarProps = StackProps & {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filteredItems: SettingsItem[];
};

export function SettingsSidebar({ searchQuery, setSearchQuery, filteredItems, ...props }: SettingsSidebarProps) {
	const { selectedIndex } = useTabsContext();

	return (
		<Stack spacing={8} {...props}>
			<HStack
				_hover={{
					bg: 'hoverBg',
				}}
				borderRadius="md"
				p={2}
			>
				<SkeletonCircle size="16" />
				<Box>
					<Heading fontWeight="semibold" size="sm">
						Manoj Shrestha
					</Heading>
					<Text fontSize="xs" fontWeight="medium">
						manojxshrestha@outlook.com
					</Text>
				</Box>
			</HStack>

			<InputGroup>
				<InputRightElement pointerEvents="none">
					<Icon as={IoSearch} boxSize={4} />
				</InputRightElement>
				<Input
					border="none"
					borderBottom="1px solid"
					borderColor="whiteAlpha.700"
					borderRadius="md"
					borderStyle="inset"
					placeholder="Find a setting"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</InputGroup>

			<ButtonGroup colorScheme="gray" variant="ghost">
				<TabList gap={1} w="full">
					{filteredItems.map((item, index) => (
						<Tab
							_selected={{
								_before: {
									content: '""',
									position: 'absolute',
									top: '50%',
									left: 0,
									transform: 'translateY(-50%)',
									width: '3px',
									height: '40%',
									bg: 'primary',
									borderRadius: 'lg',
								},
							}}
							as={Button}
							bg={index === selectedIndex ? 'hoverBg' : 'transparent'}
							color="inherit"
							fontSize="sm"
							fontWeight="normal"
							iconSpacing={4}
							justifyContent="flex-start"
							key={item.label}
							leftIcon={item.icon}
							position="relative"
						>
							{item.label}
						</Tab>
					))}
				</TabList>
			</ButtonGroup>
		</Stack>
	);
}

export function Settings() {
	const [activeIndex, setIndex] = useState(3);
	const [searchQuery, setSearchQuery] = useState('');

	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) return settingsItems;
		
		const query = searchQuery.toLowerCase();
		return settingsItems.filter(item => 
			item.label.toLowerCase().includes(query) ||
			item.keywords?.some(keyword => keyword.toLowerCase().includes(query))
		);
	}, [searchQuery]);

	const handleTabChange = useCallback((index: number) => {
		setIndex(index);
	}, []);

	return (
		<Tabs
			height="full"
			index={activeIndex}
			isLazy
			lazyBehavior="unmount"
			onChange={handleTabChange}
			orientation="vertical"
			variant="unstyled"
			width="full"
		>
			<Grid gap={8} gridTemplateColumns="300px 1fr" p={4} w="full">
				<GridItem>
					<SettingsSidebar 
						position="sticky" 
						top={4} 
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						filteredItems={filteredItems}
					/>
				</GridItem>

				<GridItem
					margin="0 auto"
					maxWidth="1024px"
					position="relative"
					width="full"
				>
					<TabPanels>
						{filteredItems.map((item) => (
							<TabPanel key={item.label}>{item.panel}</TabPanel>
						))}
					</TabPanels>
				</GridItem>
			</Grid>
		</Tabs>
	);
}
