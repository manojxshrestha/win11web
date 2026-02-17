'use client';

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Divider,
  Badge,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  FiBell,
  FiCalendar,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiX,
} from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

// Animation variants for notifications panel
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

const notificationVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.15,
    },
  },
};

// Calendar Grid Component
function CalendarGrid({ currentDate }: { currentDate: Date }) {
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const today = currentDate.getDate();
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const calendarDays: (number | null)[] = [];
  
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Box>
      <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={1}>
        {daysOfWeek.map((day) => (
          <Box
            key={day}
            textAlign="center"
            fontSize="xs"
            fontWeight="medium"
            color="gray.500"
            py={1}
          >
            {day}
          </Box>
        ))}
      </Grid>
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {calendarDays.map((day, index) => (
          <Box
            key={index}
            borderRadius="full"
            w="24px"
            h="24px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={day === today ? 'blue.500' : 'transparent'}
            color={day === today ? 'white' : day ? undefined : 'transparent'}
            fontWeight={day === today ? 'bold' : 'normal'}
            fontSize="xs"
            _hover={{ 
              bg: day === today ? 'blue.600' : day ? useColorModeValue('gray.200', 'gray.600') : 'transparent'
            }}
            cursor={day ? 'pointer' : 'default'}
          >
            {day || ''}
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

export function NotificationsCenter() {
  const notificationsDisclosure = useDisclosure();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'System Update',
      message: 'Windows 11 is up to date',
      type: 'success',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: 2,
      title: 'Network Connected',
      message: 'Connected to local network',
      type: 'info',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
    {
      id: 3,
      title: 'Storage Low',
      message: 'C: drive is running low on space',
      type: 'warning',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
  ]);

  const unreadBg = useColorModeValue('blue.50', 'blue.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return FiCheck;
      case 'warning':
        return FiAlertCircle;
      case 'error':
        return FiAlertCircle;
      default:
        return FiInfo;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'green.500';
      case 'warning':
        return 'orange.500';
      case 'error':
        return 'red.500';
      default:
        return 'blue.500';
    }
  };

  // Current time for calendar
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Popover
      gutter={16}
      offset={[-200, 16]}
      placement="top-end"
      {...notificationsDisclosure}
    >
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            aria-label="Notifications"
            icon={<Icon as={FiBell} boxSize={5} />}
            size="sm"
            variant="ghost"
            _hover={{ background: 'hoverBg' }}
          />
          {unreadCount > 0 && (
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              colorScheme="red"
              borderRadius="full"
              fontSize="xs"
              minW="18px"
              h="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <Portal>
        <AnimatePresence>
          {notificationsDisclosure.isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panelVariants}
            >
              <PopoverContent w="380px">
                <PopoverHeader
                  fontWeight="semibold"
                  borderBottomWidth="1px"
                  px={4}
                  py={3}
                >
                  <HStack justify="space-between">
                    <Text>Notifications</Text>
                    {unreadCount > 0 && (
                      <Button size="xs" variant="ghost" onClick={markAllAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </HStack>
                </PopoverHeader>
                <PopoverBody p={0} maxH="500px" overflowY="auto">
                  {/* Enhanced Calendar Widget */}
                  <Box
                    px={4}
                    py={3}
                    borderBottomWidth="1px"
                    borderColor={borderColor}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                  >
                    <HStack spacing={3} mb={3}>
                      <Icon as={FiCalendar} boxSize={5} color="blue.500" />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {formatDate(currentTime)}
                        </Text>
                        <HStack fontSize="xs" color="gray.500">
                          <Icon as={FiClock} boxSize={3} />
                          <Text>
                            {currentTime.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    {/* Calendar Grid */}
                    <CalendarGrid currentDate={currentTime} />
                  </Box>

                  {/* Notifications List */}
                  {notifications.length === 0 ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py={8}
                      color="gray.500"
                    >
                      <Icon as={FiBell} boxSize={8} mb={2} />
                      <Text fontSize="sm">No notifications</Text>
                    </Flex>
                  ) : (
                    <VStack spacing={0} align="stretch" divider={<Divider />}>
                      <AnimatePresence mode="popLayout">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            variants={notificationVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                          >
                            <Flex
                              px={4}
                              py={3}
                              bg={notification.read ? 'transparent' : unreadBg}
                              _hover={{ bg: hoverBg }}
                              cursor="pointer"
                              onClick={() => markAsRead(notification.id)}
                              role="group"
                            >
                              <Icon
                                as={getIcon(notification.type)}
                                boxSize={5}
                                color={getColor(notification.type)}
                                mt={1}
                                mr={3}
                              />
                              <Box flex={1}>
                                <Text fontSize="sm" fontWeight="medium">
                                  {notification.title}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {notification.message}
                                </Text>
                                <Text fontSize="xs" color="gray.400" mt={1}>
                                  {formatTime(notification.timestamp)}
                                </Text>
                              </Box>
                              <IconButton
                                aria-label="Clear"
                                icon={<FiX />}
                                size="xs"
                                variant="ghost"
                                opacity={0}
                                _groupHover={{ opacity: 1 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(notification.id);
                                }}
                              />
                            </Flex>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </VStack>
                  )}
                </PopoverBody>
              </PopoverContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </Popover>
  );
}

export default NotificationsCenter;
