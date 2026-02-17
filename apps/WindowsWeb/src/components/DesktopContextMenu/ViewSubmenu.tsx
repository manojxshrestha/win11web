import {
	HStack,
	Icon,
	MenuDivider,
	MenuItemOption,
	MenuList,
	MenuOptionGroup,
	Text,
} from '@chakra-ui/react';
import { BiCheck } from 'react-icons/bi';
import { BsGrid } from 'react-icons/bs';
import { CiGrid42 } from 'react-icons/ci';
import {
	PiDesktopFill,
	PiDotDuotone,
	PiSlideshowBold,
} from 'react-icons/pi';
import { TbBoxAlignTopLeft, TbSquareRounded } from 'react-icons/tb';

export type IconSize = 'large' | 'medium' | 'small';

interface ViewSubmenuProps {
	iconSize?: IconSize;
	onIconSizeChange?: (size: IconSize) => void;
	showDesktopIcons?: boolean;
	onShowDesktopIconsChange?: (show: boolean) => void;
}

export function ViewSubmenu({
	iconSize = 'medium',
	onIconSizeChange,
	showDesktopIcons = true,
	onShowDesktopIconsChange,
}: ViewSubmenuProps) {
	const handleSizeChange = (value: string) => {
		if (onIconSizeChange && (value === 'large' || value === 'medium' || value === 'small')) {
			onIconSizeChange(value);
		}
	};

	const handleShowDesktopIcons = () => {
		if (onShowDesktopIconsChange) {
			onShowDesktopIconsChange(!showDesktopIcons);
		}
	};

	return (
		<MenuList>
			<MenuOptionGroup
				value={iconSize}
				type="radio"
				onChange={(value) => handleSizeChange(value as string)}
			>
				<MenuItemOption
					closeOnSelect={false}
					icon={<Icon as={PiDotDuotone} boxSize={5} />}
					value="large"
				>
					<HStack justifyContent="space-between">
						<HStack>
							<Icon as={TbSquareRounded} />
							<Text>Large icons</Text>
						</HStack>

						<Text fontSize="xs" fontWeight="light" opacity={0.6}>
							Ctrl+Shift+2
						</Text>
					</HStack>
				</MenuItemOption>

				<MenuItemOption
					closeOnSelect={false}
					icon={<Icon as={PiDotDuotone} boxSize={5} />}
					value="medium"
				>
					<HStack justifyContent="space-between">
						<HStack>
							<Icon as={PiSlideshowBold} />
							<Text>Medium icons</Text>
						</HStack>

						<Text fontSize="xs" fontWeight="light" opacity={0.6}>
							Ctrl+Shift+3
						</Text>
					</HStack>
				</MenuItemOption>

				<MenuItemOption
					closeOnSelect={false}
					icon={<Icon as={PiDotDuotone} boxSize={5} />}
					value="small"
				>
					<HStack justifyContent="space-between">
						<HStack>
							<Icon as={BsGrid} />
							<Text>Small icons</Text>
						</HStack>

						<Text fontSize="xs" fontWeight="light" opacity={0.6}>
							Ctrl+Shift+4
						</Text>
					</HStack>
				</MenuItemOption>
			</MenuOptionGroup>

			<MenuDivider />

			<MenuOptionGroup type="checkbox">
				<MenuItemOption
					closeOnSelect={false}
					icon={<Icon as={BiCheck} />}
					value="auto"
				>
					<HStack>
						<Icon
							as={CiGrid42}
							sx={{
								path: {
									strokeWidth: '1px',

									'&:nth-child(1)': {
										color: 'blue.600',
										fill: 'blue.600',
									},
								},
							}}
						/>
						<Text>Auto arrange icons</Text>
					</HStack>
				</MenuItemOption>

				<MenuItemOption
					closeOnSelect={false}
					icon={<Icon as={BiCheck} />}
					value="align"
				>
					<HStack>
						<Icon
							as={TbBoxAlignTopLeft}
							sx={{
								'& > path:nth-child(2)': {
									color: 'blue.600',
								},
							}}
						/>
						<Text>Align icons to grid</Text>
					</HStack>
				</MenuItemOption>
			</MenuOptionGroup>

			<MenuDivider />

			<MenuItemOption
				closeOnSelect={true}
				icon={<Icon as={BiCheck} />}
				isChecked={showDesktopIcons}
				onClick={handleShowDesktopIcons}
				value="show"
			>
				<HStack>
					<Icon as={PiDesktopFill} />
					<Text>Show desktop icons</Text>
				</HStack>
			</MenuItemOption>
		</MenuList>
	);
}
