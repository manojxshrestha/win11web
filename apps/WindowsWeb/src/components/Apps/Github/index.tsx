'use client';

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Button,
  useColorModeValue,
  Image,
  Heading,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  FiSearch,
  FiPlus,
  FiBell,
  FiGithub,
  FiGitBranch,
  FiGitCommit,
  FiGitPullRequest,
  FiAlertCircle,
  FiStar,
  FiCode,
  FiFile,
  FiSettings,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';
// FiAlertOctagon alias for FiAlertCircle
const FiAlertOctagon = FiAlertCircle;

interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  sha: string;
}

export function Github() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = useColorModeValue('#ffffff', '#0d1117');
  const borderColor = useColorModeValue('#e1e4e8', '#30363d');
  const textPrimary = useColorModeValue('#24292e', '#c9d1d9');
  const textSecondary = useColorModeValue('#586069', '#8b949e');
  const hoverBg = useColorModeValue('#f6f8fa', '#161b22');
  const blueAccent = useColorModeValue('#0366d6', '#58a6ff');
  const greenAccent = useColorModeValue('#2ea44f', '#238636');

  const repositories: Repository[] = [
    {
      id: '1',
      name: 'Windows-11-web',
      description: 'A Windows 11 web clone built with React and Next.js',
      language: 'TypeScript',
      stars: 1250,
      forks: 234,
      updatedAt: '2 hours ago',
    },
    {
      id: '2',
      name: 'react-components',
      description: 'A collection of reusable React components',
      language: 'TypeScript',
      stars: 892,
      forks: 156,
      updatedAt: '1 day ago',
    },
    {
      id: '3',
      name: 'node-api-template',
      description: 'RESTful API template with Node.js and Express',
      language: 'JavaScript',
      stars: 567,
      forks: 89,
      updatedAt: '3 days ago',
    },
  ];

  const commits: Commit[] = [
    {
      id: '1',
      message: 'feat: Add new calculator component',
      author: 'John Doe',
      date: '2024-01-15',
      sha: 'a1b2c3d',
    },
    {
      id: '2',
      message: 'fix: Resolve navigation bug in Edge browser',
      author: 'Jane Smith',
      date: '2024-01-14',
      sha: 'e4f5g6h',
    },
    {
      id: '3',
      message: 'docs: Update README with installation instructions',
      author: 'John Doe',
      date: '2024-01-13',
      sha: 'i7j8k9l',
    },
  ];

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f1e05a',
      Python: '#3572A5',
      CSS: '#563d7c',
      HTML: '#e34c26',
    };
    return colors[lang] || '#858585';
  };

  return (
    <Flex h="100%" bg={bgColor} direction="column" overflow="hidden">
      {/* Header */}
      <Box
        bg={useColorModeValue('#24292e', '#161b22')}
        px={4}
        py={2}
      >
        <HStack justify="space-between">
          <HStack spacing={4}>
            <FiGithub color="white" size={32} />
            <InputGroup size="sm" w="300px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color={textSecondary} />
              </InputLeftElement>
              <Input
                placeholder="Search or jump to..."
                bg={useColorModeValue('#3f4448', '#0d1117')}
                border="none"
                color="white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </HStack>
          <HStack spacing={2}>
            <Button size="sm" variant="ghost" color="white" leftIcon={<FiPlus />}>
              New
            </Button>
            <IconButton
              aria-label="Notifications"
              icon={<FiBell />}
              variant="ghost"
              color="white"
              size="sm"
            />
            <IconButton
              aria-label="Profile"
              icon={<FiUser />}
              variant="ghost"
              color="white"
              size="sm"
            />
          </HStack>
        </HStack>
      </Box>

      {/* Main Content */}
      <Flex flex={1} overflow="hidden">
        {/* Sidebar */}
        <Box
          w="250px"
          bg={useColorModeValue('#f6f8fa', '#0d1117')}
          borderRight="1px solid"
          borderColor={borderColor}
          p={4}
          overflowY="auto"
        >
          <VStack align="stretch" spacing={4}>
            {/* Repositories */}
            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={textSecondary}
                textTransform="uppercase"
                mb={2}
              >
                Top repositories
              </Text>
              <VStack align="stretch" spacing={2}>
                {repositories.map(repo => (
                  <HStack
                    key={repo.id}
                    px={2}
                    py={1}
                    borderRadius="md"
                    _hover={{ bg: hoverBg }}
                    cursor="pointer"
                  >
                    <FiGitBranch color={textSecondary} size={14} />
                    <Text color={blueAccent} fontSize="sm" fontWeight="medium" noOfLines={1}>
                      {repo.name}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Recent Activity */}
            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={textSecondary}
                textTransform="uppercase"
                mb={2}
              >
                Recent activity
              </Text>
              <VStack align="stretch" spacing={2}>
                <HStack px={2} py={1}>
                  <FiGitCommit color={textSecondary} size={14} />
                  <Text color={textPrimary} fontSize="sm" noOfLines={1}>
                    Windows-11-web: feat: Add calculator
                  </Text>
                </HStack>
                <HStack px={2} py={1}>
                  <FiGitPullRequest color={textSecondary} size={14} />
                  <Text color={textPrimary} fontSize="sm" noOfLines={1}>
                    react-components: PR #45 merged
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Box>

        {/* Main Area */}
        <Box flex={1} p={6} overflowY="auto">
          {/* Profile Section */}
          <HStack spacing={6} mb={6}>
            <Avatar
              size="2xl"
              name="John Doe"
              src="https://bit.ly/dan-abramov"
            />
            <VStack align="start" spacing={2}>
              <Heading size="lg" color={textPrimary}>
                John Doe
              </Heading>
              <Text color={textSecondary}>johndoe</Text>
              <Text color={textPrimary}>
                Full-stack developer passionate about building beautiful web applications.
              </Text>
              <HStack spacing={4}>
                <HStack spacing={1}>
                  <FiUser size={14} color={textSecondary} />
                  <Text color={textSecondary} fontSize="sm">12 followers</Text>
                </HStack>
                <HStack spacing={1}>
                  <FiGitBranch size={14} color={textSecondary} />
                  <Text color={textSecondary} fontSize="sm">8 following</Text>
                </HStack>
              </HStack>
            </VStack>
          </HStack>

          {/* Tabs */}
          <Tabs variant="soft-rounded" colorScheme="blue" mb={6}>
            <TabList>
              <Tab><HStack spacing={1}><FiCode /><Text>Overview</Text></HStack></Tab>
              <Tab><HStack spacing={1}><FiGitBranch /><Text>Repositories</Text><Badge>{repositories.length}</Badge></HStack></Tab>
              <Tab><HStack spacing={1}><FiGitPullRequest /><Text>Pull Requests</Text></HStack></Tab>
              <Tab><HStack spacing={1}><FiAlertOctagon /><Text>Issues</Text></HStack></Tab>
              <Tab><HStack spacing={1}><FiSettings /><Text>Settings</Text></HStack></Tab>
            </TabList>

            <TabPanels>
              {/* Overview Panel */}
              <TabPanel px={0}>
                <VStack align="stretch" spacing={4}>
                  {/* Pinned Repositories */}
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color={textPrimary} mb={3}>
                      Pinned
                    </Text>
                    <HStack spacing={4} flexWrap="wrap">
                      {repositories.map(repo => (
                        <Box
                          key={repo.id}
                          w="300px"
                          p={4}
                          border="1px solid"
                          borderColor={borderColor}
                          borderRadius="md"
                          _hover={{ borderColor: blueAccent, cursor: 'pointer' }}
                        >
                          <HStack justify="space-between" mb={2}>
                            <HStack spacing={2}>
                              <FiGitBranch color={blueAccent} size={16} />
                              <Text color={blueAccent} fontWeight="medium">
                                {repo.name}
                              </Text>
                            </HStack>
                          </HStack>
                          <Text color={textSecondary} fontSize="sm" noOfLines={2} mb={3}>
                            {repo.description}
                          </Text>
                          <HStack spacing={4} fontSize="xs" color={textSecondary}>
                            <HStack spacing={1}>
                              <Box w={3} h={3} borderRadius="full" bg={getLanguageColor(repo.language)} />
                              <Text>{repo.language}</Text>
                            </HStack>
                            <HStack spacing={1}>
                              <FiStar size={12} />
                              <Text>{repo.stars}</Text>
                            </HStack>
                            <HStack spacing={1}>
                              <FiGitBranch size={12} />
                              <Text>{repo.forks}</Text>
                            </HStack>
                          </HStack>
                        </Box>
                      ))}
                    </HStack>
                  </Box>

                  {/* Recent Activity */}
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color={textPrimary} mb={3}>
                      Recent activity
                    </Text>
                    <VStack align="stretch" spacing={2}>
                      {commits.map(commit => (
                        <HStack
                          key={commit.id}
                          p={3}
                          border="1px solid"
                          borderColor={borderColor}
                          borderRadius="md"
                          _hover={{ bg: hoverBg }}
                        >
                          <VStack align="start" spacing={1} flex={1}>
                            <Text color={textPrimary} fontSize="sm" fontWeight="medium">
                              {commit.message}
                            </Text>
                            <HStack spacing={2} fontSize="xs" color={textSecondary}>
                              <Text>{commit.author}</Text>
                              <Text>committed {commit.date}</Text>
                            </HStack>
                          </VStack>
                          <HStack spacing={1} color={textSecondary}>
                            <FiGitCommit size={14} />
                            <Text fontSize="sm" fontFamily="monospace">
                              {commit.sha}
                            </Text>
                          </HStack>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Repositories Panel */}
              <TabPanel px={0}>
                <VStack align="stretch" spacing={3}>
                  {repositories.map(repo => (
                    <Box
                      key={repo.id}
                      p={4}
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="md"
                      _hover={{ bg: hoverBg }}
                    >
                      <HStack justify="space-between" mb={2}>
                        <HStack spacing={2}>
                          <FiGitBranch color={blueAccent} size={18} />
                          <Text color={blueAccent} fontWeight="medium" fontSize="lg">
                            {repo.name}
                          </Text>
                          <Badge colorScheme="blue" variant="outline">
                            Public
                          </Badge>
                        </HStack>
                        <HStack spacing={2}>
                          <Button size="xs" leftIcon={<FiStar />} colorScheme="yellow" variant="outline">
                            Star
                          </Button>
                          <Button size="xs" leftIcon={<FiCode />} colorScheme="blue" variant="outline">
                            Code
                          </Button>
                        </HStack>
                      </HStack>
                      <Text color={textSecondary} fontSize="sm" mb={2}>
                        {repo.description}
                      </Text>
                      <HStack spacing={4} fontSize="xs" color={textSecondary}>
                        <HStack spacing={1}>
                          <Box w={3} h={3} borderRadius="full" bg={getLanguageColor(repo.language)} />
                          <Text>{repo.language}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <FiStar size={12} />
                          <Text>{repo.stars}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <FiGitBranch size={12} />
                          <Text>{repo.forks}</Text>
                        </HStack>
                        <Text>Updated {repo.updatedAt}</Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>

              {/* Pull Requests Panel */}
              <TabPanel px={0}>
                <VStack align="center" py={10}>
                  <FiGitPullRequest size={48} color={textSecondary} />
                  <Text color={textPrimary} fontSize="lg" mt={4}>
                    No open pull requests
                  </Text>
                  <Text color={textSecondary} fontSize="sm">
                    When you open a pull request, it will appear here.
                  </Text>
                </VStack>
              </TabPanel>

              {/* Issues Panel */}
              <TabPanel px={0}>
                <VStack align="center" py={10}>
                  <FiAlertCircle size={48} color={textSecondary} />
                  <Text color={textPrimary} fontSize="lg" mt={4}>
                    No issues created
                  </Text>
                  <Text color={textSecondary} fontSize="sm">
                    When you create an issue, it will appear here.
                  </Text>
                </VStack>
              </TabPanel>

              {/* Settings Panel */}
              <TabPanel px={0}>
                <VStack align="stretch" spacing={4}>
                  <Box p={4} border="1px solid" borderColor={borderColor} borderRadius="md">
                    <Heading size="md" color={textPrimary} mb={4}>
                      Profile
                    </Heading>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Text color={textSecondary} fontSize="sm" mb={1}>
                          Name
                        </Text>
                        <Input defaultValue="John Doe" />
                      </Box>
                      <Box>
                        <Text color={textSecondary} fontSize="sm" mb={1}>
                          Bio
                        </Text>
                        <Input defaultValue="Full-stack developer passionate about building beautiful web applications." />
                      </Box>
                      <Box>
                        <Text color={textSecondary} fontSize="sm" mb={1}>
                          Email
                        </Text>
                        <Input defaultValue="john.doe@example.com" />
                      </Box>
                      <Button colorScheme="blue" alignSelf="flex-start">
                        Save Profile
                      </Button>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Github;
