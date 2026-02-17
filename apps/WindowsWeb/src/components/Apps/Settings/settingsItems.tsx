import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Icon,
	Input,
	Progress,
	Radio,
	RadioGroup,
	Select,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Stack,
	Switch,
	Text,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';
import {
	FaBluetooth,
	FaClock,
	FaCloud,
	FaGamepad,
	FaLock,
	FaUser,
} from 'react-icons/fa';
import {
	FaDisplay,
	FaVolumeHigh,
	FaVolumeXmark,
	FaWifi,
} from 'react-icons/fa6';
import { FiSettings } from 'react-icons/fi';

import { Personalisation } from '@/components/Apps/Settings/Personalization';
import { useSystem } from '@/contexts/System';
import AccessibilityIcon from '@/public/icons/Accessibility.webp';
import AccountsIcon from '@/public/icons/Accounts.webp';
import AppsIcon from '@/public/icons/Apps.webp';
import BluetoothIcon from '@/public/icons/Bluetooth.webp';
import GamingIcon from '@/public/icons/Gaming.webp';
import PersonalisationIcon from '@/public/icons/Personalisation.webp';
import PrivacyIcon from '@/public/icons/Privacy.webp';
import SystemIcon from '@/public/icons/System.webp';
import TimeIcon from '@/public/icons/Time.webp';
import WifiIcon from '@/public/icons/wifi.webp';
import UpdateIcon from '@/public/icons/WindowsUpdate.webp';

// System Settings Panel
function SystemPanel() {
	const { sound: [soundLevel, setSound], soundMuted: [muted, { toggle: toggleMute }], brightness: [brightnessLevel, setBrightness] } = useSystem();
	const [powerMode, setPowerMode] = useState('balanced');

	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				System
			</Heading>

			<Accordion allowMultiple allowToggle defaultIndex={[0, 1, 2, 3, 4]}>
				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaDisplay} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Display</Text>
								<Text fontSize="xs" color="gray.500">
									Night light, brightness, resolution
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Flex justify="space-between" align="center">
								<Text>Night light</Text>
								<Switch defaultChecked />
							</Flex>
							<Box>
								<Text fontWeight="medium" mb={2}>
									Brightness
								</Text>
								<Slider 
									aria-label="brightness" 
									value={brightnessLevel}
									onChange={setBrightness}
								>
									<SliderTrack>
										<SliderFilledTrack />
									</SliderTrack>
									<SliderThumb />
								</Slider>
							</Box>
							<Divider />
							<Box>
								<Text fontWeight="medium" mb={2}>
									Display resolution
								</Text>
								<Select defaultValue="1920x1080">
									<option value="1920x1080">1920 x 1080 (Recommended)</option>
									<option value="2560x1440">2560 x 1440</option>
									<option value="3840x2160">3840 x 2160 (4K)</option>
								</Select>
							</Box>
							<Box>
								<Text fontWeight="medium" mb={2}>
									Display scale
								</Text>
								<Select defaultValue="100">
									<option value="100">100% (Recommended)</option>
									<option value="125">125%</option>
									<option value="150">150%</option>
									<option value="200">200%</option>
								</Select>
							</Box>
						</VStack>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaVolumeHigh} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Sound</Text>
								<Text fontSize="xs" color="gray.500">
									Volume, device, spatial sound
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Flex justify="space-between" align="center">
								<Text>Output device</Text>
								<Text color="gray.500" fontSize="sm">
									Realtek Audio
								</Text>
							</Flex>
							<Box>
								<Flex justify="space-between" mb={2}>
									<Text fontWeight="medium">Volume</Text>
									<Button
										size="xs"
										variant="ghost"
										onClick={toggleMute}
									>
										<Icon as={muted ? FaVolumeXmark : FaVolumeHigh} />
									</Button>
								</Flex>
								<Slider
									aria-label="volume"
									value={soundLevel}
									onChange={setSound}
								>
									<SliderTrack>
										<SliderFilledTrack />
									</SliderTrack>
									<SliderThumb />
								</Slider>
							</Box>
							<Divider />
							<FormControl display="flex" alignItems="center">
								<Switch id="spatial-sound" />
								<FormLabel htmlFor="spatial-sound" mb={0} ml={2}>
									Spatial sound
								</FormLabel>
							</FormControl>
						</VStack>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FiSettings} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Notifications</Text>
								<Text fontSize="xs" color="gray.500">
									Do not disturb, focus assist
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Flex justify="space-between" align="center">
								<Box>
									<Text fontWeight="medium">Do not disturb</Text>
									<Text fontSize="xs" color="gray.500">
										Silence notifications
									</Text>
								</Box>
								<Switch />
							</Flex>
							<Divider />
							<Box>
								<Text fontWeight="medium" mb={2}>
									Focus assist
								</Text>
								<RadioGroup defaultValue="off">
									<Stack spacing={2}>
										<Radio value="off">Off</Radio>
										<Radio value="priority">Priority only</Radio>
										<Radio value="alarms">Alarms only</Radio>
									</Stack>
								</RadioGroup>
							</Box>
						</VStack>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FiSettings} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Power & battery</Text>
								<Text fontSize="xs" color="gray.500">
									Power mode, battery usage
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Box>
								<Text fontWeight="medium" mb={2}>
									Power mode
								</Text>
								<RadioGroup value={powerMode} onChange={setPowerMode}>
									<Stack spacing={2}>
										<Radio value="best-power">
											<Box>
												<Text fontWeight="medium">Best power efficiency</Text>
												<Text fontSize="xs" color="gray.500">Save battery by limiting some apps and features</Text>
											</Box>
										</Radio>
										<Radio value="balanced">
											<Box>
												<Text fontWeight="medium">Balanced</Text>
												<Text fontSize="xs" color="gray.500">Automatically balance performance and battery</Text>
											</Box>
										</Radio>
										<Radio value="best-performance">
											<Box>
												<Text fontWeight="medium">Best performance</Text>
												<Text fontSize="xs" color="gray.500">Get the best performance at the cost of more battery</Text>
											</Box>
										</Radio>
									</Stack>
								</RadioGroup>
							</Box>
							<Divider />
							<Box>
								<Text fontWeight="medium" mb={2}>Battery level</Text>
								<Flex align="center" gap={4}>
									<Progress value={85} size="lg" width="200px" colorScheme="green" borderRadius="full" />
									<Text>85%</Text>
								</Flex>
							</Box>
							<FormControl display="flex" alignItems="center">
								<Switch id="battery-saver" />
								<FormLabel htmlFor="battery-saver" mb={0} ml={2}>
									Battery saver
								</FormLabel>
							</FormControl>
						</VStack>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FiSettings} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Storage</Text>
								<Text fontSize="xs" color="gray.500">
									Storage usage, cleanup
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Box>
								<Text fontWeight="medium" mb={2}>Storage usage</Text>
								<Progress value={68} size="lg" width="full" colorScheme="blue" borderRadius="full" />
								<Flex justify="space-between" mt={2}>
									<Text fontSize="sm">Used: 476 GB</Text>
									<Text fontSize="sm">Free: 224 GB</Text>
									<Text fontSize="sm">Total: 700 GB</Text>
								</Flex>
							</Box>
							<Divider />
							<VStack align="stretch" spacing={2}>
								<Text fontWeight="medium">Storage breakdown</Text>
								{[
									{ name: 'Apps & features', size: '145 GB', color: 'blue' },
									{ name: 'Documents', size: '89 GB', color: 'green' },
									{ name: 'System files', size: '78 GB', color: 'purple' },
									{ name: 'Temporary files', size: '45 GB', color: 'orange' },
									{ name: 'Other', size: '119 GB', color: 'gray' },
								].map((item) => (
									<Flex key={item.name} justify="space-between" align="center" p={2} _hover={{ bg: 'hoverBg' }} borderRadius="md">
										<HStack>
											<Box w={3} h={3} borderRadius="full" bg={`${item.color}.400`} />
											<Text>{item.name}</Text>
										</HStack>
										<Text fontSize="sm" color="gray.500">{item.size}</Text>
									</Flex>
								))}
							</VStack>
							<Button colorScheme="blue" size="sm">Storage cleanup</Button>
						</VStack>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Stack>
	);
}

// Bluetooth & Devices Panel
function BluetoothPanel() {
	const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
	const [devices, setDevices] = useState([
		{ name: 'Surface Mouse', connected: true, type: 'mouse', battery: 85 },
		{ name: 'Surface Keyboard', connected: true, type: 'keyboard', battery: 72 },
		{ name: 'Audio Speaker', connected: false, type: 'audio', battery: 45 },
	]);
	const [mouseSpeed, setMouseSpeed] = useState(50);
	const [scrollLines, setScrollLines] = useState(6);
	const [keyboardRepeat, setKeyboardRepeat] = useState(50);
	const [keyboardDelay, setKeyboardDelay] = useState(50);

	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				Bluetooth & devices
			</Heading>

			<Accordion allowMultiple allowToggle defaultIndex={[0, 1, 2]}>
				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaBluetooth} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Bluetooth</Text>
								<Text fontSize="xs" color="gray.500">
									Manage your Bluetooth devices
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Flex justify="space-between" align="center">
								<Box>
									<Text fontWeight="medium">Bluetooth</Text>
									<Text fontSize="xs" color="gray.500">
										{bluetoothEnabled ? 'On' : 'Off'}
									</Text>
								</Box>
								<Switch
									isChecked={bluetoothEnabled}
									onChange={() => setBluetoothEnabled(!bluetoothEnabled)}
								/>
							</Flex>

							<Divider />

							<Box>
								<Text fontWeight="medium" mb={3}>
									Devices
								</Text>
								<VStack align="stretch" spacing={2}>
									{devices.map((device, index) => (
										<Flex
											key={index}
											justify="space-between"
											align="center"
											p={2}
											_hover={{ bg: 'hoverBg' }}
											borderRadius="md"
										>
											<HStack>
												<Icon
													as={FaBluetooth}
													color={device.connected ? 'blue.400' : 'gray.400'}
												/>
												<Box>
													<Text fontWeight="medium">{device.name}</Text>
													<Text fontSize="xs" color="gray.500">
														{device.connected ? `Connected • Battery ${device.battery}%` : 'Not connected'}
													</Text>
												</Box>
											</HStack>
											<Button size="sm" variant="ghost">
												{device.connected ? 'Disconnect' : 'Connect'}
											</Button>
										</Flex>
									))}
									</VStack>
								</Box>

								<Button colorScheme="gray" variant="outline">
									Add device
								</Button>
							</VStack>
						</AccordionPanel>
					</AccordionItem>

					<AccordionItem>
						<AccordionButton>
							<HStack flex={1} spacing={4} textAlign="left">
								<Icon as={FiSettings} boxSize={5} />
								<Box>
									<Text fontWeight="medium">Mouse</Text>
									<Text fontSize="xs" color="gray.500">
										Mouse settings and options
									</Text>
								</Box>
							</HStack>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel>
							<VStack align="stretch" spacing={4}>
								<Flex justify="space-between" align="center">
									<Text>Mouse pointer speed</Text>
									<Slider w="200px" value={mouseSpeed} onChange={setMouseSpeed}>
										<SliderTrack>
											<SliderFilledTrack />
										</SliderTrack>
										<SliderThumb />
									</Slider>
								</Flex>
								<Flex justify="space-between" align="center">
									<Text>Scroll lines per notch</Text>
									<Slider w="200px" min={1} max={20} value={scrollLines} onChange={setScrollLines}>
										<SliderTrack>
											<SliderFilledTrack />
										</SliderTrack>
										<SliderThumb />
									</Slider>
								</Flex>
								<FormControl display="flex" alignItems="center">
									<Switch id="enhance-pointer" defaultChecked />
									<FormLabel htmlFor="enhance-pointer" mb={0} ml={2}>
										Enhance pointer precision
									</FormLabel>
								</FormControl>
								<FormControl display="flex" alignItems="center">
									<Switch id="snap-to" />
									<FormLabel htmlFor="snap-to" mb={0} ml={2}>
										Snap pointer to default button
									</FormLabel>
								</FormControl>
							</VStack>
						</AccordionPanel>
					</AccordionItem>

					<AccordionItem>
						<AccordionButton>
							<HStack flex={1} spacing={4} textAlign="left">
								<Icon as={FiSettings} boxSize={5} />
								<Box>
									<Text fontWeight="medium">Keyboard</Text>
									<Text fontSize="xs" color="gray.500">
										Keyboard settings and options
									</Text>
								</Box>
							</HStack>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel>
							<VStack align="stretch" spacing={4}>
								<Flex justify="space-between" align="center">
									<Text>Repeat delay</Text>
									<Slider w="200px" value={keyboardDelay} onChange={setKeyboardDelay}>
										<SliderTrack>
											<SliderFilledTrack />
										</SliderTrack>
										<SliderThumb />
									</Slider>
								</Flex>
								<Flex justify="space-between" align="center">
									<Text>Repeat rate</Text>
									<Slider w="200px" value={keyboardRepeat} onChange={setKeyboardRepeat}>
										<SliderTrack>
											<SliderFilledTrack />
										</SliderTrack>
										<SliderThumb />
									</Slider>
								</Flex>
								<FormControl display="flex" alignItems="center">
									<Switch id="sticky-keys" />
									<FormLabel htmlFor="sticky-keys" mb={0} ml={2}>
										Sticky keys
									</FormLabel>
								</FormControl>
								<FormControl display="flex" alignItems="center">
									<Switch id="filter-keys" />
									<FormLabel htmlFor="filter-keys" mb={0} ml={2}>
										Filter keys
									</FormLabel>
								</FormControl>
								<FormControl display="flex" alignItems="center">
									<Switch id="toggle-keys" defaultChecked />
									<FormLabel htmlFor="toggle-keys" mb={0} ml={2}>
										Toggle keys
									</FormLabel>
								</FormControl>
							</VStack>
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</Stack>
		);
	}

// Network & Internet Panel
function NetworkPanel() {
	const [wifiEnabled, setWifiEnabled] = useState(true);
	const [proxyEnabled, setProxyEnabled] = useState(false);
	const [dataUsage, setDataUsage] = useState({
		total: 45.2,
		limit: 100,
	});

	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				Network & internet
			</Heading>

			<Accordion allowMultiple allowToggle defaultIndex={[0, 1, 2, 3]}>
				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaWifi} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Wi-Fi</Text>
								<Text fontSize="xs" color="gray.500">
									Connect to wireless networks
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Flex justify="space-between" align="center">
								<Box>
									<Text fontWeight="medium">Wi-Fi</Text>
									<Text fontSize="xs" color="gray.500">
										{wifiEnabled ? 'On' : 'Off'}
									</Text>
								</Box>
								<Switch
									isChecked={wifiEnabled}
									onChange={() => setWifiEnabled(!wifiEnabled)}
								/>
							</Flex>

							<Divider />

							<Box>
								<Text fontWeight="medium" mb={3}>
									Available networks
								</Text>
								<VStack align="stretch" spacing={2}>
									{[
										{ name: 'HomeNetwork', secured: true, signal: 4, connected: true },
										{ name: 'NeighborWiFi', secured: true, signal: 3, connected: false },
										{ name: 'GuestNetwork', secured: false, signal: 2, connected: false },
									].map((network, index) => (
										<Flex
											key={index}
											justify="space-between"
											align="center"
											p={2}
											_hover={{ bg: 'hoverBg' }}
											borderRadius="md"
											cursor="pointer"
										>
											<HStack>
												<Icon
													as={FaWifi}
													color={network.connected ? 'blue.400' : network.signal >= 3 ? 'green.400' : 'yellow.400'}
												/>
												<Box>
													<Text fontWeight="medium">{network.name}</Text>
													<Text fontSize="xs" color="gray.500">
														{network.connected ? 'Connected' : network.secured ? 'Secured' : 'Open'}
													</Text>
												</Box>
											</HStack>
											<Button size="sm" variant="ghost" colorScheme={network.connected ? 'blue' : 'gray'}>
												{network.connected ? 'Disconnect' : 'Connect'}
											</Button>
										</Flex>
									))}
									</VStack>
								</Box>
								<FormControl display="flex" alignItems="center">
									<Switch id="random-mac" defaultChecked />
									<FormLabel htmlFor="random-mac" mb={0} ml={2}>
										Use random hardware addresses
									</FormLabel>
								</FormControl>
							</VStack>
						</AccordionPanel>
					</AccordionItem>

					<AccordionItem>
						<AccordionButton>
							<HStack flex={1} spacing={4} textAlign="left">
								<Icon as={FiSettings} boxSize={5} />
								<Box>
									<Text fontWeight="medium">Data usage</Text>
									<Text fontSize="xs" color="gray.500">
										View data usage
									</Text>
								</Box>
							</HStack>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel>
							<VStack align="stretch" spacing={4}>
								<Box>
									<Text fontWeight="medium" mb={2}>Data usage</Text>
									<Progress 
										value={(dataUsage.total / dataUsage.limit) * 100} 
										size="lg" 
										width="full" 
										colorScheme="blue" 
										borderRadius="full" 
									/>
									<Flex justify="space-between" mt={2}>
										<Text fontSize="sm">Used: {dataUsage.total} GB</Text>
										<Text fontSize="sm">Limit: {dataUsage.limit} GB</Text>
									</Flex>
								</Box>
								<Button size="sm" variant="outline">Reset data usage</Button>
							</VStack>
						</AccordionPanel>
					</AccordionItem>

					<AccordionItem>
						<AccordionButton>
							<HStack flex={1} spacing={4} textAlign="left">
								<Icon as={FaCloud} boxSize={5} />
								<Box>
									<Text fontWeight="medium">VPN</Text>
									<Text fontSize="xs" color="gray.500">
										Virtual private network
									</Text>
								</Box>
							</HStack>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel>
							<VStack align="stretch" spacing={4}>
								<Button colorScheme="blue" size="sm">
									Add a VPN connection
								</Button>
								<Text fontSize="sm" color="gray.500">
									No VPN connections configured
								</Text>
							</VStack>
						</AccordionPanel>
					</AccordionItem>

					<AccordionItem>
						<AccordionButton>
							<HStack flex={1} spacing={4} textAlign="left">
								<Icon as={FiSettings} boxSize={5} />
								<Box>
									<Text fontWeight="medium">Proxy</Text>
									<Text fontSize="xs" color="gray.500">
										Configure proxy settings
									</Text>
								</Box>
							</HStack>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel>
							<VStack align="stretch" spacing={4}>
								<Flex justify="space-between" align="center">
									<Text fontWeight="medium">Use a proxy server</Text>
									<Switch
										isChecked={proxyEnabled}
										onChange={() => setProxyEnabled(!proxyEnabled)}
									/>
								</Flex>
								{proxyEnabled && (
									<>
										<Box>
											<Text fontWeight="medium" mb={2}>Proxy server address</Text>
											<Input placeholder="proxy.example.com:8080" />
										</Box>
										<FormControl display="flex" alignItems="center">
											<Switch id="proxy-bypass" defaultChecked />
											<FormLabel htmlFor="proxy-bypass" mb={0} ml={2}>
												Bypass proxy for local addresses
											</FormLabel>
										</FormControl>
									</>
								)}
							</VStack>
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</Stack>
		);
	}

// Apps Panel
function AppsPanel() {
	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				Apps
			</Heading>

			<Accordion allowMultiple allowToggle defaultIndex={[0]}>
				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FiSettings} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Apps & features</Text>
								<Text fontSize="xs" color="gray.500">
									Install and manage apps
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Input placeholder="Search apps" />
							<VStack align="stretch" spacing={1}>
								{[
									{ name: 'Microsoft Edge', size: '150 MB' },
									{ name: 'Windows Terminal', size: '45 MB' },
									{ name: 'Notepad', size: '12 MB' },
									{ name: 'Calculator', size: '8 MB' },
									{ name: 'Photos', size: '120 MB' },
								].map((app, index) => (
									<Flex
										key={index}
										justify="space-between"
										align="center"
										p={2}
										_hover={{ bg: 'hoverBg' }}
										borderRadius="md"
									>
										<Text fontWeight="medium">{app.name}</Text>
										<HStack>
											<Text fontSize="sm" color="gray.500">
												{app.size}
											</Text>
											<Button size="xs" variant="ghost">
												Advanced options
											</Button>
										</HStack>
									</Flex>
								))}
							</VStack>
						</VStack>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FiSettings} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Default apps</Text>
								<Text fontSize="xs" color="gray.500">
									Choose default apps for file types and protocols
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={3}>
							{[
								{ type: 'Web browser', defaultApp: 'Microsoft Edge' },
								{ type: 'Email', defaultApp: 'Mail' },
								{ type: 'Photos', defaultApp: 'Photos' },
								{ type: 'Maps', defaultApp: 'Maps' },
							].map((item, index) => (
								<Flex
									key={index}
									justify="space-between"
									align="center"
									p={2}
									_hover={{ bg: 'hoverBg' }}
									borderRadius="md"
									cursor="pointer"
								>
									<Text>{item.type}</Text>
									<Button size="sm" variant="ghost">
										{item.defaultApp}
									</Button>
								</Flex>
							))}
						</VStack>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Stack>
	);
}

// Accounts Panel
function AccountsPanel() {
	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				Accounts
			</Heading>

			<Accordion allowMultiple allowToggle defaultIndex={[0, 1]}>
				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaUser} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Your account</Text>
								<Text fontSize="xs" color="gray.500">
									Manage your Microsoft account
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Flex align="center" gap={4}>
								<Box
									borderRadius="full"
									bg="blue.500"
									color="white"
									h="64px"
									w="64px"
									display="flex"
									alignItems="center"
									justifyContent="center"
									fontSize="2xl"
								>
									MS
								</Box>
								<Box>
									<Text fontWeight="medium" fontSize="lg">
										Manoj Shrestha
									</Text>
									<Text color="gray.500">manojxshrestha@outlook.com</Text>
									<Text fontSize="xs" color="green.500">
										Local account
									</Text>
								</Box>
							</Flex>

							<Divider />

							<Button variant="outline" colorScheme="blue" size="sm">
								Manage my Microsoft account
							</Button>
						</VStack>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FiSettings} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Sign-in options</Text>
								<Text fontSize="xs" color="gray.500">
									PIN, Windows Hello, dynamic lock
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<FormControl display="flex" alignItems="center">
								<Switch id="pin" defaultChecked />
								<FormLabel htmlFor="pin" mb={0} ml={2}>
									Use PIN
								</FormLabel>
							</FormControl>
							<FormControl display="flex" alignItems="center">
								<Switch id="hello" />
								<FormLabel htmlFor="hello" mb={0} ml={2}>
									Windows Hello Face
								</FormLabel>
							</FormControl>
							<FormControl display="flex" alignItems="center">
								<Switch id="dynamic-lock" />
								<FormLabel htmlFor="dynamic-lock" mb={0} ml={2}>
									Dynamic lock
								</FormLabel>
							</FormControl>
						</VStack>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Stack>
	);
}

// Time & Language Panel
function TimePanel() {
	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				Time & language
			</Heading>

			<Accordion allowMultiple allowToggle defaultIndex={[0, 1]}>
				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaClock} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Date & time</Text>
								<Text fontSize="xs" color="gray.500">
									Set time zone and calendar
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<FormControl display="flex" alignItems="center">
								<Switch id="set-time" defaultChecked />
								<FormLabel htmlFor="set-time" mb={0} ml={2}>
									Set time automatically
								</FormLabel>
							</FormControl>
							<FormControl display="flex" alignItems="center">
								<Switch id="set-timezone" defaultChecked />
								<FormLabel htmlFor="set-timezone" mb={0} ml={2}>
									Set time zone automatically
								</FormLabel>
							</FormControl>
							<Divider />
							<Box>
								<Text fontWeight="medium" mb={2}>
									Time zone
								</Text>
								<Select defaultValue="UTC+5:45">
									<option value="UTC+0">UTC (GMT)</option>
									<option value="UTC+5:45">Asia/Kathmandu (UTC+5:45)</option>
									<option value="UTC+5:30">Asia/Kolkata (UTC+5:30)</option>
									<option value="UTC+8">Asia/Shanghai (UTC+8)</option>
								</Select>
							</Box>
							<FormControl display="flex" alignItems="center">
								<Switch id="24-hour" />
								<FormLabel htmlFor="24-hour" mb={0} ml={2}>
									Use 24-hour clock
								</FormLabel>
							</FormControl>
						</VStack>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaUser} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Language & region</Text>
								<Text fontSize="xs" color="gray.500">
									Display language, regional format
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Box>
								<Text fontWeight="medium" mb={2}>
									Windows display language
								</Text>
								<Select defaultValue="en-US">
									<option value="en-US">English (United States)</option>
									<option value="en-GB">English (United Kingdom)</option>
									<option value="zh-CN">中文(简体)</option>
								</Select>
							</Box>
							<Button variant="outline" size="sm">
								Install language pack
							</Button>
							<Divider />
							<Box>
								<Text fontWeight="medium" mb={2}>
									Regional format
								</Text>
								<Select defaultValue="en-US">
									<option value="en-US">English (United States)</option>
									<option value="ne-NP">नेपाली (नेपाल)</option>
								</Select>
							</Box>
						</VStack>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Stack>
	);
}

// Gaming Panel
function GamingPanel() {
	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				Gaming
			</Heading>

			<Accordion allowMultiple allowToggle defaultIndex={[0]}>
				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaGamepad} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Xbox Game Bar</Text>
								<Text fontSize="xs" color="gray.500">
									Capture and share
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<FormControl display="flex" alignItems="center">
								<Switch id="gamebar" defaultChecked />
								<FormLabel htmlFor="gamebar" mb={0} ml={2}>
									Enable Xbox Game Bar
								</FormLabel>
							</FormControl>
							<FormControl display="flex" alignItems="center">
								<Switch id="game DVR" defaultChecked />
								<FormLabel htmlFor="game DVR" mb={0} ml={2}>
									Record game clips and screenshots using Game DVR
								</FormLabel>
							</FormControl>
							<Box>
								<Text fontWeight="medium" mb={2}>
									Audio
								</Text>
								<Slider defaultValue={80}>
									<SliderTrack>
										<SliderFilledTrack />
									</SliderTrack>
									<SliderThumb />
								</Slider>
							</Box>
						</VStack>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Stack>
	);
}

// Accessibility Panel
function AccessibilityPanel() {
	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				Accessibility
			</Heading>

			<Accordion allowMultiple allowToggle defaultIndex={[0, 1]}>
				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaDisplay} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Visual effects</Text>
								<Text fontSize="xs" color="gray.500">
									Animation, transparency, scrollbars
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<FormControl display="flex" alignItems="center">
								<Switch id="animations" />
								<FormLabel htmlFor="animations" mb={0} ml={2}>
									Show animations in Windows
								</FormLabel>
							</FormControl>
							<FormControl display="flex" alignItems="center">
								<Switch id="transparency" defaultChecked />
								<FormLabel htmlFor="transparency" mb={0} ml={2}>
									Transparency effects
								</FormLabel>
							</FormControl>
							<FormControl display="flex" alignItems="center">
								<Switch id="scrollbars" defaultChecked />
								<FormLabel htmlFor="scrollbars" mb={0} ml={2}>
									Show scrollbars
								</FormLabel>
							</FormControl>
						</VStack>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaVolumeHigh} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Audio</Text>
								<Text fontSize="xs" color="gray.500">
									Sound, captions, audio description
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<FormControl display="flex" alignItems="center">
								<Switch id="captions" defaultChecked />
								<FormLabel htmlFor="captions" mb={0} ml={2}>
									Turn on closed captions
								</FormLabel>
							</FormControl>
							<FormControl display="flex" alignItems="center">
								<Switch id="audio-description" />
								<FormLabel htmlFor="audio-description" mb={0} ml={2}>
									Audio description
								</FormLabel>
							</FormControl>
						</VStack>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Stack>
	);
}

// Privacy & Security Panel
function PrivacyPanel() {
	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				Privacy & security
			</Heading>

			<Accordion allowMultiple allowToggle defaultIndex={[0, 1]}>
				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FaLock} boxSize={5} />
							<Box>
								<Text fontWeight="medium">Windows Security</Text>
								<Text fontSize="xs" color="gray.500">
									Protect your device
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={4}>
							<Flex justify="space-between" align="center" p={3} bg="green.50" borderRadius="md">
								<HStack>
									<Icon as={FaLock} color="green.500" />
									<Box>
										<Text fontWeight="medium" color="green.700">
											Device security
										</Text>
										<Text fontSize="xs" color="green.600">
											Protected
										</Text>
									</Box>
								</HStack>
								<Button size="sm" colorScheme="green" variant="outline">
									Open Security
								</Button>
							</Flex>
						</VStack>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<AccordionButton>
						<HStack flex={1} spacing={4} textAlign="left">
							<Icon as={FiSettings} boxSize={5} />
							<Box>
								<Text fontWeight="medium">App permissions</Text>
								<Text fontSize="xs" color="gray.500">
									Manage app access to location, camera, microphone
								</Text>
							</Box>
						</HStack>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={2}>
							{[
								{ name: 'Location', allowed: true },
								{ name: 'Camera', allowed: true },
								{ name: 'Microphone', allowed: true },
								{ name: 'Notifications', allowed: true },
								{ name: 'Speech', allowed: false },
							].map((permission, index) => (
								<Flex
									key={index}
									justify="space-between"
									align="center"
									p={2}
									_hover={{ bg: 'hoverBg' }}
									borderRadius="md"
									cursor="pointer"
								>
									<Text>{permission.name}</Text>
									<Switch isChecked={permission.allowed} />
								</Flex>
							))}
						</VStack>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Stack>
	);
}

// Windows Update Panel
function WindowsUpdatePanel() {
	const [checking, setChecking] = useState(false);
	const [lastChecked, setLastChecked] = useState('Today at 10:30 AM');

	const handleCheckForUpdates = () => {
		setChecking(true);
		setTimeout(() => {
			setChecking(false);
			setLastChecked('Just now');
		}, 3000);
	};

	return (
		<Stack spacing={6}>
			<Heading fontWeight="medium" size="lg">
				Windows Update
			</Heading>

			<VStack align="stretch" spacing={4}>
				<Box p={4} bg="blue.50" borderRadius="md">
					<Flex justify="space-between" align="center">
						<Box>
							<Text fontWeight="medium">You're up to date</Text>
							<Text fontSize="sm" color="gray.600">
								Last checked: {lastChecked}
							</Text>
						</Box>
						<Button
							colorScheme="blue"
							onClick={handleCheckForUpdates}
							isLoading={checking}
							loadingText="Checking..."
						>
							Check for updates
						</Button>
					</Flex>
				</Box>

				<Accordion allowToggle>
					<AccordionItem>
						<AccordionButton>
							<HStack flex={1} spacing={4} textAlign="left">
								<Icon as={FiSettings} boxSize={5} />
								<Box>
									<Text fontWeight="medium">Advanced options</Text>
									<Text fontSize="xs" color="gray.500">
										Optional updates, active hours
									</Text>
								</Box>
							</HStack>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel>
							<VStack align="stretch" spacing={4}>
								<FormControl display="flex" alignItems="center">
									<Switch id="restart" defaultChecked />
									<FormLabel htmlFor="restart" mb={0} ml={2}>
										Restart this device as soon as possible
									</FormLabel>
								</FormControl>
								<FormControl display="flex" alignItems="center">
									<Switch id="update-other" defaultChecked />
									<FormLabel htmlFor="update-other" mb={0} ml={2}>
										Get the latest updates as soon as they're available
									</FormLabel>
								</FormControl>
								<Divider />
								<Box>
									<Text fontWeight="medium" mb={2}>
										Active hours
									</Text>
									<Text fontSize="sm" color="gray.500">
										8:00 AM - 5:00 PM
									</Text>
									<Button size="sm" variant="link" colorScheme="blue" mt={2}>
										Change
									</Button>
								</Box>
							</VStack>
						</AccordionPanel>
					</AccordionItem>
				</Accordion>

				<Box>
					<Text fontSize="sm" color="gray.500">
						Version 22H2 (OS Build 22621.2428)
					</Text>
					<Button size="sm" variant="link" colorScheme="blue">
						View update history
					</Button>
				</Box>
			</VStack>
		</Stack>
	);
}

export interface SettingsItem {
	label: string;
	icon: React.ReactElement;
	panel: React.ReactElement;
	keywords?: string[];
}

export const settingsItems: SettingsItem[] = [
	{
		label: 'System',
		icon: <Image alt="system" src={SystemIcon} unoptimized width={18} />,
		panel: <SystemPanel />,
		keywords: ['display', 'sound', 'notifications', 'power', 'battery', 'storage', 'brightness', 'volume', 'resolution', 'night light'],
	},
	{
		label: 'Bluetooth & devices',
		icon: <Image alt="bluetooth" src={BluetoothIcon} width={18} />,
		panel: <BluetoothPanel />,
		keywords: ['bluetooth', 'mouse', 'keyboard', 'devices', 'wireless', 'connect'],
	},
	{
		label: 'Network & internet',
		icon: <Image alt="network" src={WifiIcon} width={18} />,
		panel: <NetworkPanel />,
		keywords: ['wifi', 'network', 'internet', 'vpn', 'proxy', 'ethernet', 'connection'],
	},
	{
		label: 'Personalization',
		icon: (
			<Image
				alt="personalization"
				src={PersonalisationIcon}
				width={18}
			/>
		),
		panel: <Personalisation />,
		keywords: ['wallpaper', 'background', 'theme', 'color', 'accent', 'dark mode', 'light mode', 'transparency', 'animation'],
	},
	{
		label: 'Apps',
		icon: <Image alt="apps" src={AppsIcon} width={18} />,
		panel: <AppsPanel />,
		keywords: ['apps', 'applications', 'install', 'uninstall', 'default apps'],
	},
	{
		label: 'Accounts',
		icon: <Image alt="accounts" src={AccountsIcon} width={18} />,
		panel: <AccountsPanel />,
		keywords: ['account', 'user', 'profile', 'sign in', 'login', 'microsoft'],
	},
	{
		label: 'Time & language',
		icon: <Image alt="time" src={TimeIcon} width={18} />,
		panel: <TimePanel />,
		keywords: ['time', 'date', 'language', 'region', 'timezone', 'clock', 'format'],
	},
	{
		label: 'Gaming',
		icon: <Image alt="gaming" src={GamingIcon} width={18} />,
		panel: <GamingPanel />,
		keywords: ['game', 'xbox', 'game bar', 'dvr', 'capture', 'record'],
	},
	{
		label: 'Accessibility',
		icon: (
			<Image alt="accessibility" src={AccessibilityIcon} width={18} />
		),
		panel: <AccessibilityPanel />,
		keywords: ['accessibility', 'visual', 'audio', 'captions', 'animation', 'transparency'],
	},
	{
		label: 'Privacy & security',
		icon: <Image alt="privacy" src={PrivacyIcon} width={18} />,
		panel: <PrivacyPanel />,
		keywords: ['privacy', 'security', 'location', 'camera', 'microphone', 'permissions', 'windows security'],
	},
	{
		label: 'Windows Update',
		icon: <Image alt="update" src={UpdateIcon} width={18} />,
		panel: <WindowsUpdatePanel />,
		keywords: ['update', 'windows update', 'upgrade', 'patch', 'version'],
	},
];
