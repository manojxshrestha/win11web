import { HStack, Icon, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { BsSortAlphaDown, BsSortNumericDown } from 'react-icons/bs';
import { FiFile, FiCalendar } from 'react-icons/fi';

interface SortbySubmenuProps {
	onSortByName?: () => void;
	onSortByDateModified?: () => void;
	onSortBySize?: () => void;
	onSortByItemType?: () => void;
}

export function SortbySubmenu({
	onSortByName,
	onSortByDateModified,
	onSortBySize,
	onSortByItemType,
}: SortbySubmenuProps) {
	const handleName = () => {
		if (onSortByName) onSortByName();
	};

	const handleDateModified = () => {
		if (onSortByDateModified) onSortByDateModified();
	};

	const handleSize = () => {
		if (onSortBySize) onSortBySize();
	};

	const handleItemType = () => {
		if (onSortByItemType) onSortByItemType();
	};

	return (
		<MenuList>
			<MenuItem icon={<Icon as={BsSortAlphaDown} boxSize={4} />} onClick={handleName}>
				<HStack>
					<Text>Name</Text>
				</HStack>
			</MenuItem>
			<MenuItem
				icon={<Icon as={FiCalendar} boxSize={4} />}
				onClick={handleDateModified}
			>
				<HStack>
					<Text>Date modified</Text>
				</HStack>
			</MenuItem>
			<MenuItem
				icon={<Icon as={BsSortNumericDown} boxSize={4} />}
				onClick={handleSize}
			>
				<HStack>
					<Text>Size</Text>
				</HStack>
			</MenuItem>
			<MenuItem icon={<Icon as={FiFile} boxSize={4} />} onClick={handleItemType}>
				<HStack>
					<Text>Item type</Text>
				</HStack>
			</MenuItem>
		</MenuList>
	);
}
