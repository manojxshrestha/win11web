import { HStack, Icon, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { BsFileEarmarkText, BsFileText, BsFolderPlus, BsPlusSquare } from 'react-icons/bs';

interface NewSubmenuProps {
	onNewFolder?: () => void;
	onNewShortcut?: () => void;
	onNewTextDocument?: () => void;
	onNewWordDocument?: () => void;
	onNewExcelWorkbook?: () => void;
}

export function NewSubmenu({
	onNewFolder,
	onNewShortcut,
	onNewTextDocument,
	onNewWordDocument,
	onNewExcelWorkbook,
}: NewSubmenuProps) {
	const handleFolder = () => {
		if (onNewFolder) onNewFolder();
	};

	const handleShortcut = () => {
		if (onNewShortcut) onNewShortcut();
	};

	const handleTextDocument = () => {
		if (onNewTextDocument) onNewTextDocument();
	};

	const handleWordDocument = () => {
		if (onNewWordDocument) onNewWordDocument();
	};

	const handleExcelWorkbook = () => {
		if (onNewExcelWorkbook) onNewExcelWorkbook();
	};

	return (
		<MenuList>
			<MenuItem icon={<Icon as={BsFolderPlus} boxSize={4} />} onClick={handleFolder}>
				<HStack>
					<Text>Folder</Text>
				</HStack>
			</MenuItem>
			<MenuItem icon={<Icon as={BsPlusSquare} boxSize={4} />} onClick={handleShortcut}>
				<HStack>
					<Text>Shortcut</Text>
				</HStack>
			</MenuItem>
			<MenuItem
				icon={<Icon as={BsFileText} boxSize={4} />}
				onClick={handleTextDocument}
			>
				<HStack>
					<Text>Text Document</Text>
				</HStack>
			</MenuItem>
			<MenuItem
				icon={<Icon as={BsFileEarmarkText} boxSize={4} color="blue.500" />}
				onClick={handleWordDocument}
			>
				<HStack>
					<Text>Word Document</Text>
				</HStack>
			</MenuItem>
			<MenuItem
				icon={<Icon as={BsFileEarmarkText} boxSize={4} color="green.500" />}
				onClick={handleExcelWorkbook}
			>
				<HStack>
					<Text>Excel Workbook</Text>
				</HStack>
			</MenuItem>
		</MenuList>
	);
}
