import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Card,
	CardBody,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Icon,
	Radio,
	RadioGroup,
	SkeletonText,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Stack,
	StackDivider,
	Switch,
	Text,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import { CustomSelect } from '@repo/ui/components';
import type { OptionBase } from 'chakra-react-select';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { FaDesktop, FaImage, FaMoon, FaSun } from 'react-icons/fa';
import { RiArrowRightSLine } from 'react-icons/ri';
import { VscColorMode } from 'react-icons/vsc';

import { wallpaperFitOptions, accentColors } from '@/contexts/System/helpers';
import { useSystem } from '@/contexts/System';
import type { WallpaperFitStyle } from '@/contexts/System/helpers';
import type { Wallpaper } from '@/contexts/System/System';
import Wallpapers1 from '@/public/wallpapers/1-win11.jpg';
import Wallpapers2 from '@/public/wallpapers/2-win11.jpg';
import Wallpapers3 from '@/public/wallpapers/3-win11.png';
import Wallpapers4 from '@/public/wallpapers/4-win11.jpg';
import Wallpapers5 from '@/public/wallpapers/5-win11.jpg';
import Wallpapers6 from '@/public/wallpapers/6-win11.jpg';
import Wallpapers7 from '@/public/wallpapers/7-win11.jpg';
import Wallpapers8 from '@/public/wallpapers/8-win11.png';

const Wallpapers = [
	Wallpapers1,
	Wallpapers2,
	Wallpapers3,
	Wallpapers4,
	Wallpapers5,
	Wallpapers6,
	Wallpapers7,
	Wallpapers8,
];

type WallpaperFitOption = OptionBase & {
	value: WallpaperFitStyle;
	label: WallpaperFitStyle;
};

type BackgroundType = 'picture' | 'solid' | 'slideshow';

export function Personalisation() {
	const {
		wallpaper: [currentWallpaper, changeWallpaper],
		wallpaperFit: [wallpaperFit, changeWallpaperFit],
		accentColor: [currentAccentColor, changeAccentColor],
		theme: [currentTheme, changeTheme],
	} = useSystem();

	const [, startTransition] = useTransition();
	const [backgroundType, setBackgroundType] = useState<BackgroundType>('picture');
	const [slideshowInterval, setSlideshowInterval] = useState(30);

	const { colorMode, toggleColorMode: toggleChakraColorMode } = useSystem() as any;

	const taskBarStyles = { baseStyle: { bg: 'blackAlpha.900' } };

	// Sync theme with Chakra UI color mode
	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', currentTheme);
			const body = document.body;
			if (currentTheme === 'dark') {
				body.classList.add('dark');
			} else {
				body.classList.remove('dark');
			}
		}
	}, [currentTheme]);

	const handleChangeWallpaper = useCallback(
		(wallpaper: Wallpaper) => () => {
			startTransition(() => {
				changeWallpaper(wallpaper);
			});
		},
		[changeWallpaper]
	);

	const handleChangeWallpaperFit = useCallback(
		(option: WallpaperFitOption | null) => {
			changeWallpaperFit(option?.value ?? 'cover');
		},
		[changeWallpaperFit]
	);

	const handleThemeChange = useCallback(
		(newTheme: string) => {
			startTransition(() => {
				changeTheme(newTheme as 'light' | 'dark');
			});
		},
		[changeTheme]
	);

	const handleAccentColorChange = useCallback(
		(color: string) => {
			startTransition(() => {
				changeAccentColor(color);
			});
		},
		[changeAccentColor]
	);

	return (
		<Stack spacing={8}>
			<HStack spacing={4}>
				<Heading fontWeight="medium" size="lg">
					Personalization
				</Heading>
				<Icon as={RiArrowRightSLine} boxSize={7} />
				<Heading fontWeight="medium" size="lg">
					Background
				</Heading>
			</HStack>

			<motion.div
				animate={{ y: 0, opacity: 1 }}
				exit={{ opacity: 0 }}
				initial={{
					y: 100,
					opacity: 0.33,
				}}
				transition={{
					duration: 0.2,
					delay: 0.1,
					ease: 'easeOut',
				}}
			>
				<Stack spacing={8}>
					<Box
						border="8px solid black"
						borderRadius="xl"
						h="175px"
						position="relative"
						w="350px"
					>
						<Image
							alt="current-wallpaper"
							fill
							quality={100}
							sizes="350px"
							src={currentWallpaper}
							placeholder="blur"
							style={{
								objectFit: 'cover',
							}}
						/>

						<Card
							height="70%"
							position="absolute"
							right={4}
							size="sm"
							top={4}
							width="90px"
						>
							<CardBody
								alignItems="flex-end"
								display="flex"
								flexDirection="column"
								justifyContent="space-between"
							>
								<SkeletonText
									noOfLines={4}
									skeletonHeight={0.5}
									speed={0}
									startColor="white"
									w="full"
								/>
								<Button borderRadius="sm" h={2.5} p={0} size="xs" />
							</CardBody>
						</Card>

						<Box
							bottom={0}
							pointerEvents="none"
							position="absolute"
							w="full"
						>
							<Box __css={taskBarStyles} h={4} />
						</Box>
					</Box>

					<Accordion allowMultiple allowToggle defaultIndex={[0, 1, 2]}>
						<AccordionItem
							sx={{
								'.chakra-collapse': {
									overflow: 'visible !important',
								},
							}}
						>
							<AccordionButton>
								<HStack flex={1} spacing={6} textAlign="left">
									<Icon as={FaImage} boxSize={6} />
									<Box>
										<Text>Personalize your background</Text>
										<Text fontSize="xs">
											A picture background applies to your current
											desktop. Solid color or slideshow backgrounds
											apply to all desktops
										</Text>
									</Box>
								</HStack>
								<AccordionIcon />
							</AccordionButton>

							<AccordionPanel>
								<Stack divider={<StackDivider />} spacing={4}>
									<RadioGroup
										onChange={(value) => setBackgroundType(value as BackgroundType)}
										value={backgroundType}
									>
										<Stack spacing={3}>
											<Radio value="picture">
												<Text>Picture</Text>
											</Radio>
											<Radio value="solid">
												<Text>Solid color</Text>
											</Radio>
											<Radio value="slideshow">
												<Text>Slideshow</Text>
											</Radio>
										</Stack>
									</RadioGroup>

									{backgroundType === 'picture' && (
										<Box>
											<Text mb={2} fontWeight="medium">
												Recent images
											</Text>
											<Wrap>
												{Wallpapers.map((wallpaper) => (
													<WrapItem key={wallpaper.src}>
														<Box
															_hover={{
																filter:
																	'brightness(1.025) contrast(1.025) saturate(105%)',
																'& img': {
																	transform: 'scale(1.2)',
																},
															}}
															borderRadius="sm"
															filter="brightness(0.975)"
															h="100px"
															onClick={handleChangeWallpaper(wallpaper)}
															overflow="hidden"
															position="relative"
															w="100px"
														>
															<Image
																alt="wallpaper"
																fill
																quality={100}
																sizes="100px"
																src={wallpaper}
																style={{
																	objectFit: 'cover',
																	borderRadius: '0.25rem',
																	transition:
																		'transform 6s cubic-bezier(0.25, 0.45, 0.45, 0.95)',
																}}
																placeholder="blur"
															/>
														</Box>
													</WrapItem>
												))}
											</Wrap>
										</Box>
									)}

									{backgroundType === 'slideshow' && (
										<VStack align="stretch" spacing={4}>
											<Box>
												<Text fontWeight="medium" mb={2}>
													Slide show folder
												</Text>
												<Button colorScheme="gray" isDisabled>
													Browse
												</Button>
											</Box>
											<Box>
												<Text fontWeight="medium" mb={2}>
													Change picture every
												</Text>
												<HStack spacing={4}>
													<Slider
														aria-label="slideshow-interval"
														max={60}
														min={1}
														value={slideshowInterval}
														onChange={setSlideshowInterval}
													>
														<SliderTrack>
															<SliderFilledTrack />
														</SliderTrack>
														<SliderThumb />
													</Slider>
													<Text minW="80px">
														{slideshowInterval} minutes
													</Text>
												</HStack>
											</Box>
											<FormControl
												alignItems="center"
												display="flex"
												flexDirection="row"
											>
												<Switch id="shuffle" size="md" />
												<FormLabel htmlFor="shuffle" mb={0} ml={2}>
													Shuffle
												</FormLabel>
											</FormControl>
										</VStack>
									)}

									<HStack justifyContent="space-between">
										<Text>Choose a fit for your desktop image</Text>

										<Box w="160px">
											<CustomSelect<WallpaperFitOption, false>
												isSearchable={false}
												menuPlacement="auto"
												onChange={handleChangeWallpaperFit}
												openMenuOnFocus
												options={wallpaperFitOptions.map(
													(option) => ({
														label: option,
														value: option,
													})
												)}
												value={{
													label: wallpaperFit,
													value: wallpaperFit,
												}}
											/>
										</Box>
									</HStack>

									<HStack justifyContent="space-between">
										<Text>Choose a photo</Text>

										<Button colorScheme="gray" isDisabled>
											Browse photos
										</Button>
									</HStack>
								</Stack>
							</AccordionPanel>
						</AccordionItem>

						<AccordionItem>
							<AccordionButton>
								<HStack flex={1} spacing={6} textAlign="left">
									<Icon as={VscColorMode} boxSize={6} />
									<Box>
										<Text>Color mode</Text>
										<Text fontSize="xs">
											Change the color mode of your desktop
										</Text>
									</Box>
								</HStack>
								<AccordionIcon />
							</AccordionButton>

							<AccordionPanel>
								<RadioGroup
									onChange={handleThemeChange}
									value={currentTheme}
								>
									<Stack spacing={4}>
										<Flex
											_hover={{ bg: 'hoverBg' }}
											align="center"
											borderRadius="md"
											p={3}
											onClick={() => handleThemeChange('light')}
											cursor="pointer"
											bg={currentTheme === 'light' ? 'hoverBg' : 'transparent'}
										>
											<Icon as={FaSun} boxSize={6} mr={4} />
											<Box>
												<Text fontWeight="medium">Light</Text>
												<Text fontSize="xs" color="gray.500">
													Light mode looks clean and simple
												</Text>
											</Box>
										</Flex>
										<Flex
											_hover={{ bg: 'hoverBg' }}
											align="center"
											borderRadius="md"
											p={3}
											onClick={() => handleThemeChange('dark')}
											cursor="pointer"
											bg={currentTheme === 'dark' ? 'hoverBg' : 'transparent'}
										>
											<Icon as={FaMoon} boxSize={6} mr={4} />
											<Box>
												<Text fontWeight="medium">Dark</Text>
												<Text fontSize="xs" color="gray.500">
													Dark mode looks sleek and easy on the eyes
												</Text>
											</Box>
										</Flex>
									</Stack>
								</RadioGroup>
							</AccordionPanel>
						</AccordionItem>

						<AccordionItem>
							<AccordionButton>
								<HStack flex={1} spacing={6} textAlign="left">
									<Icon as={FaDesktop} boxSize={6} />
									<Box>
										<Text>Accent colors</Text>
										<Text fontSize="xs">
											Choose your accent color
										</Text>
									</Box>
								</HStack>
								<AccordionIcon />
							</AccordionButton>

							<AccordionPanel>
								<VStack align="stretch" spacing={4}>
									<Box>
										<Text fontWeight="medium" mb={3}>
											Accent colors
										</Text>
										<Wrap spacing={3}>
											{accentColors.map((color) => (
												<WrapItem key={color.value}>
													<Box
														_hover={{
															transform: 'scale(1.1)',
															boxShadow: 'md',
														}}
														bg={color.value}
														borderRadius="full"
														cursor="pointer"
														h="40px"
														onClick={() => handleAccentColorChange(color.value)}
														position="relative"
														transition="all 0.2s"
														w="40px"
														border={
															currentAccentColor === color.value
																? '3px solid white'
																: 'none'
														}
														boxShadow={
															currentAccentColor === color.value
																? `0 0 0 2px ${color.value}`
																: 'sm'
														}
													>
														{currentAccentColor === color.value && (
															<Box
																		borderRadius="full"
																		border="2px solid white"
																		h="full"
																		w="full"
																	/>
														)}
													</Box>
												</WrapItem>
											))}
										</Wrap>
									</Box>

									<FormControl
									alignItems="center"
									display="flex"
									flexDirection="row"
								>
									<Switch id="transparency-effects" size="md" defaultChecked />
									<FormLabel htmlFor="transparency-effects" mb={0} ml={2}>
										Transparency effects
									</FormLabel>
								</FormControl>

								<FormControl
									alignItems="center"
									display="flex"
									flexDirection="row"
								>
									<Switch
										id="animation-effects"
										size="md"
										defaultChecked
									/>
									<FormLabel
										htmlFor="animation-effects"
										mb={0}
										ml={2}
									>
										Animation effects
									</FormLabel>
								</FormControl>

								<FormControl
									alignItems="center"
									display="flex"
									flexDirection="row"
								>
									<Switch
										id="match-primary-color"
										size="md"
									/>
									<FormLabel
										htmlFor="match-primary-color"
										mb={0}
										ml={2}
									>
										Match my accent color to my background
									</FormLabel>
								</FormControl>
								</VStack>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>

					<Text fontWeight="medium">Related settings</Text>

					<Accordion allowToggle>
						<AccordionItem>
							<AccordionButton>
								<HStack flex={1} spacing={6} textAlign="left">
									<Icon as={VscColorMode} boxSize={6} />
									<Box>
										<Text>Theme</Text>
										<Text fontSize="xs">
											Manage app themes and defaults
										</Text>
									</Box>
								</HStack>
								<AccordionIcon />
							</AccordionButton>

							<AccordionPanel>
								<VStack align="stretch" spacing={4}>
									<Text fontWeight="medium">Select which theme you want for your device</Text>
									<RadioGroup defaultValue="dark">
										<Stack spacing={4}>
											<Flex
												_hover={{ bg: 'hoverBg' }}
												align="center"
												borderRadius="md"
												p={3}
												cursor="pointer"
											>
												<Radio value="dark">Dark</Radio>
											</Flex>
											<Flex
												_hover={{ bg: 'hoverBg' }}
												align="center"
												borderRadius="md"
												p={3}
												cursor="pointer"
											>
												<Radio value="light">Light</Radio>
											</Flex>
											<Flex
												_hover={{ bg: 'hoverBg' }}
												align="center"
												borderRadius="md"
												p={3}
												cursor="pointer"
											>
												<Radio value="custom">Custom</Radio>
											</Flex>
										</Stack>
									</RadioGroup>
								</VStack>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</Stack>
			</motion.div>
		</Stack>
	);
}
