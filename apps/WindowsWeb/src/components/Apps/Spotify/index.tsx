'use client';

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
  Image,
  Heading,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiVolumeX,
  FiHeart,
  FiRepeat,
  FiShuffle,
  FiList,
  FiMic,
  FiMonitor,
} from 'react-icons/fi';
// FiMic2 doesn't exist in react-icons/fi, use FiMic instead
const FiMic2 = FiMic;

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

const defaultPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Top Hits',
    songs: [
      { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop' },
      { id: '2', title: 'Dance Monkey', artist: 'Tones and I', album: 'The Kids Are Coming', duration: '3:29', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop' },
      { id: '3', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷', duration: '3:53', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop' },
      { id: '4', title: 'Someone Like You', artist: 'Adele', album: '21', duration: '4:45', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop' },
      { id: '5', title: 'Uptown Funk', artist: 'Bruno Mars', album: 'Uptown Special', duration: '4:30', cover: 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?w=100&h=100&fit=crop' },
    ],
  },
  {
    id: '2',
    name: 'Chill Vibes',
    songs: [
      { id: '6', title: 'Sunset Boulevard', artist: 'Lofi Dreams', album: 'Night Drive', duration: '2:58', cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop' },
      { id: '7', title: 'Ocean Waves', artist: 'Peaceful Mind', album: 'Serenity', duration: '3:15', cover: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
      { id: '8', title: 'Coffee Shop', artist: 'Acoustic Sessions', album: 'Morning Brew', duration: '2:45', cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop' },
    ],
  },
  {
    id: '3',
    name: 'Workout Energy',
    songs: [
      { id: '9', title: 'Power Up', artist: 'Bass Masters', album: 'Gym Mix', duration: '3:10', cover: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=100&h=100&fit=crop' },
      { id: '10', title: 'Run Fast', artist: 'Speed Demon', album: 'Cardio Beats', duration: '2:55', cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
      { id: '11', title: 'High Energy', artist: 'DJ Maximum', album: 'Pump It Up', duration: '3:22', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&h=100&fit=crop' },
    ],
  },
];

export function Spotify() {
  const [currentSong, setCurrentSong] = useState<Song>(defaultPlaylists[0]?.songs[0] || { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', cover: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(defaultPlaylists[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const bgColor = useColorModeValue('#121212', '#121212');
  const sidebarBg = useColorModeValue('#000000', '#000000');
  const cardBg = useColorModeValue('#181818', '#181818');
  const hoverBg = useColorModeValue('#282828', '#282828');
  const textPrimary = useColorModeValue('white', 'white');
  const textSecondary = useColorModeValue('#b3b3b3', '#b3b3b3');
  const greenAccent = useColorModeValue('#1db954', '#1db954');

  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            playNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const playNext = () => {
    if (!currentPlaylist) return;
    const currentIndex = currentPlaylist.songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.songs.length;
    const nextSong = currentPlaylist.songs[nextIndex];
    if (nextSong) {
      setCurrentSong(nextSong);
    }
    setProgress(0);
  };

  const playPrevious = () => {
    if (!currentPlaylist) return;
    const currentIndex = currentPlaylist.songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? currentPlaylist.songs.length - 1 : currentIndex - 1;
    const prevSong = currentPlaylist.songs[prevIndex];
    if (prevSong) {
      setCurrentSong(prevSong);
    }
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(70);
    } else {
      setIsMuted(true);
      setVolume(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor((seconds % 60) * 3.33); // Convert progress % to seconds
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Flex h="100%" bg={bgColor} direction="column" overflow="hidden">
      {/* Main Content Area */}
      <Flex flex={1} overflow="hidden">
        {/* Sidebar */}
        <Box
          w={sidebarCollapsed ? '60px' : '240px'}
          bg={sidebarBg}
          p={3}
          transition="width 0.2s"
          overflowY="auto"
        >
          <VStack align="stretch" spacing={4}>
            {/* Main Navigation */}
            <VStack align="stretch" spacing={2}>
              <HStack
                px={3}
                py={2}
                borderRadius="md"
                _hover={{ bg: hoverBg }}
                cursor="pointer"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <FiList color={textSecondary} />
                {!sidebarCollapsed && <Text color={textPrimary} fontWeight="bold">Library</Text>}
              </HStack>
              <HStack px={3} py={2} borderRadius="md" _hover={{ bg: hoverBg }} cursor="pointer">
                <FiMic2 color={textSecondary} />
                {!sidebarCollapsed && <Text color={textSecondary}>Browse</Text>}
              </HStack>
              <HStack px={3} py={2} borderRadius="md" _hover={{ bg: hoverBg }} cursor="pointer">
                <FiMonitor color={textSecondary} />
                {!sidebarCollapsed && <Text color={textSecondary}>Radio</Text>}
              </HStack>
            </VStack>

            <Divider borderColor="gray.700" />

            {/* Playlists */}
            {!sidebarCollapsed && (
              <VStack align="stretch" spacing={2}>
                <Text color={textSecondary} fontSize="sm" fontWeight="bold" px={3}>
                  PLAYLISTS
                </Text>
                {defaultPlaylists.map(playlist => (
                  <Box
                    key={playlist.id}
                    px={3}
                    py={2}
                    borderRadius="md"
                    _hover={{ bg: hoverBg }}
                    cursor="pointer"
                    onClick={() => setCurrentPlaylist(playlist)}
                    bg={currentPlaylist?.id === playlist.id ? hoverBg : 'transparent'}
                  >
                    <Text color={textPrimary} fontSize="sm" noOfLines={1}>
                      {playlist.name}
                    </Text>
                    <Text color={textSecondary} fontSize="xs">
                      {playlist.songs.length} songs
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={6} overflowY="auto" bg={bgColor}>
          {/* Header */}
          <HStack justify="space-between" mb={6}>
            <HStack spacing={4}>
              <IconButton
                aria-label="Previous"
                icon={<FiSkipBack />}
                variant="ghost"
                color={textPrimary}
                size="lg"
                borderRadius="full"
                onClick={playPrevious}
              />
              <IconButton
                aria-label={isPlaying ? 'Pause' : 'Play'}
                icon={isPlaying ? <FiPause /> : <FiPlay />}
                variant="solid"
                bg={textPrimary}
                color={bgColor}
                size="lg"
                borderRadius="full"
                onClick={togglePlay}
                _hover={{ transform: 'scale(1.05)' }}
              />
              <IconButton
                aria-label="Next"
                icon={<FiSkipForward />}
                variant="ghost"
                color={textPrimary}
                size="lg"
                borderRadius="full"
                onClick={playNext}
              />
            </HStack>
            <HStack spacing={2}>
              <IconButton
                aria-label="Shuffle"
                icon={<FiShuffle />}
                variant="ghost"
                color={isShuffled ? greenAccent : textSecondary}
                size="sm"
                onClick={() => setIsShuffled(!isShuffled)}
              />
              <IconButton
                aria-label="Repeat"
                icon={<FiRepeat />}
                variant="ghost"
                color={isRepeated ? greenAccent : textSecondary}
                size="sm"
                onClick={() => setIsRepeated(!isRepeated)}
              />
            </HStack>
          </HStack>

          {/* Current Song Info */}
          <HStack spacing={6} mb={8}>
            <Image
              src={currentSong.cover}
              alt={currentSong.title}
              boxSize="150px"
              borderRadius="md"
              boxShadow="xl"
            />
            <VStack align="start" spacing={2}>
              <Text color={textSecondary} fontSize="sm" textTransform="uppercase">
                Now Playing
              </Text>
              <Heading size="xl" color={textPrimary} noOfLines={1}>
                {currentSong.title}
              </Heading>
              <Text color={textSecondary}>
                {currentSong.artist} • {currentSong.album}
              </Text>
            </VStack>
          </HStack>

          {/* Playlist */}
          <Text color={textPrimary} fontSize="xl" fontWeight="bold" mb={4}>
            {currentPlaylist?.name}
          </Text>
          <VStack align="stretch" spacing={1}>
            {/* Header Row */}
            <HStack px={4} py={2} color={textSecondary} fontSize="sm">
              <Text w="50px">#</Text>
              <Text flex={1}>Title</Text>
              <Text w="100px">Album</Text>
              <Text w="80px" textAlign="right">Duration</Text>
            </HStack>
            
            {currentPlaylist?.songs.map((song, index) => (
              <HStack
                key={song.id}
                px={4}
                py={2}
                borderRadius="md"
                bg={currentSong.id === song.id ? cardBg : 'transparent'}
                _hover={{ bg: currentSong.id === song.id ? cardBg : hoverBg }}
                cursor="pointer"
                onClick={() => {
                  setCurrentSong(song);
                  setProgress(0);
                  setIsPlaying(true);
                }}
              >
                <Text w="50px" color={currentSong.id === song.id ? greenAccent : textSecondary}>
                  {currentSong.id === song.id && isPlaying ? (
                    <Progress value={progress} size="xs" colorScheme="green" borderRadius="full" w="20px" />
                  ) : (
                    index + 1
                  )}
                </Text>
                <HStack flex={1} spacing={3}>
                  <Image
                    src={song.cover}
                    alt={song.title}
                    boxSize="40px"
                    borderRadius="sm"
                  />
                  <VStack align="start" spacing={0}>
                    <Text color={textPrimary} fontWeight="medium" noOfLines={1}>
                      {song.title}
                    </Text>
                    <Text color={textSecondary} fontSize="sm" noOfLines={1}>
                      {song.artist}
                    </Text>
                  </VStack>
                </HStack>
                <Text w="100px" color={textSecondary} noOfLines={1}>
                  {song.album}
                </Text>
                <HStack w="80px" justify="flex-end" spacing={2}>
                  <IconButton
                    aria-label="Favorite"
                    icon={<FiHeart />}
                    variant="ghost"
                    size="xs"
                    color={textSecondary}
                    _hover={{ color: greenAccent }}
                  />
                  <Text color={textSecondary}>{song.duration}</Text>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Flex>

      {/* Player Controls */}
      <Box
        bg={sidebarBg}
        p={3}
        borderTop="1px solid"
        borderColor="gray.800"
      >
        <HStack justify="space-between">
          {/* Current Song Mini */}
          <HStack spacing={3} w="250px">
            <Image
              src={currentSong.cover}
              alt={currentSong.title}
              boxSize="50px"
              borderRadius="sm"
            />
            <VStack align="start" spacing={0}>
              <Text color={textPrimary} fontSize="sm" fontWeight="medium" noOfLines={1}>
                {currentSong.title}
              </Text>
              <Text color={textSecondary} fontSize="xs" noOfLines={1}>
                {currentSong.artist}
              </Text>
            </VStack>
            <IconButton
              aria-label="Favorite"
              icon={<FiHeart />}
              variant="ghost"
              size="sm"
              color={textSecondary}
              _hover={{ color: greenAccent }}
            />
          </HStack>

          {/* Playback Controls */}
          <VStack spacing={1} flex={1} maxW="600px">
            <HStack spacing={4}>
              <IconButton
                aria-label="Shuffle"
                icon={<FiShuffle />}
                variant="ghost"
                size="sm"
                color={isShuffled ? greenAccent : textSecondary}
                onClick={() => setIsShuffled(!isShuffled)}
              />
              <IconButton
                aria-label="Previous"
                icon={<FiSkipBack />}
                variant="ghost"
                color={textPrimary}
                onClick={playPrevious}
              />
              <IconButton
                aria-label={isPlaying ? 'Pause' : 'Play'}
                icon={isPlaying ? <FiPause /> : <FiPlay />}
                variant="solid"
                bg={textPrimary}
                color={bgColor}
                size="md"
                borderRadius="full"
                onClick={togglePlay}
              />
              <IconButton
                aria-label="Next"
                icon={<FiSkipForward />}
                variant="ghost"
                color={textPrimary}
                onClick={playNext}
              />
              <IconButton
                aria-label="Repeat"
                icon={<FiRepeat />}
                variant="ghost"
                size="sm"
                color={isRepeated ? greenAccent : textSecondary}
                onClick={() => setIsRepeated(!isRepeated)}
              />
            </HStack>
            <HStack w="100%" spacing={3}>
              <Text color={textSecondary} fontSize="xs" w="40px" textAlign="right">
                {formatTime(progress)}
              </Text>
              <Slider
                aria-label="Playback progress"
                value={progress}
                onChange={setProgress}
                flex={1}
                focusThumbOnChange={false}
              >
                <SliderTrack bg="gray.600" h="4px">
                  <SliderFilledTrack bg={greenAccent} />
                </SliderTrack>
                <SliderThumb boxSize={3} />
              </Slider>
              <Text color={textSecondary} fontSize="xs" w="40px">
                3:20
              </Text>
            </HStack>
          </VStack>

          {/* Volume Controls */}
          <HStack w="150px" justify="flex-end">
            <IconButton
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              icon={isMuted ? <FiVolumeX /> : <FiVolume2 />}
              variant="ghost"
              size="sm"
              color={textSecondary}
              onClick={toggleMute}
            />
            <Slider
              aria-label="Volume"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              w="80px"
              focusThumbOnChange={false}
            >
              <SliderTrack bg="gray.600" h="4px">
                <SliderFilledTrack bg={textPrimary} />
              </SliderTrack>
              <SliderThumb boxSize={3} />
            </Slider>
          </HStack>
        </HStack>
      </Box>
    </Flex>
  );
}

export default Spotify;
