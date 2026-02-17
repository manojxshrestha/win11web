'use client';

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useState, useEffect, KeyboardEvent } from 'react';
import { FiMenu, FiCopy, FiRotateCcw } from 'react-icons/fi';

interface HistoryItem {
  expression: string;
  result: string;
}

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [mode, setMode] = useState<'standard' | 'scientific'>('standard');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [secondFn, setSecondFn] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const displayBg = useColorModeValue('gray.100', 'gray.700');
  const buttonBg = useColorModeValue('gray.200', 'gray.600');
  const buttonHoverBg = useColorModeValue('gray.300', 'gray.500');
  const operatorBg = useColorModeValue('#0067C0', '#4A90E2');
  const operatorHoverBg = useColorModeValue('#0056A0', '#3A80D2');
  const memoryBg = useColorModeValue('gray.300', 'gray.500');
  const functionBg = useColorModeValue('gray.100', 'gray.700');

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
    setExpression(expression + num);
  };

  const handleOperator = (op: string) => {
    if (prevValue && operator) {
      calculate();
    }
    setPrevValue(display);
    setOperator(op);
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    if (!prevValue || !operator) return;

    const prev = parseFloat(prevValue);
    const current = parseFloat(display);
    let result: number;

    try {
      switch (operator) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '×':
          result = prev * current;
          break;
        case '÷':
          if (current === 0) {
            setDisplay('Error');
            setExpression('');
            setOperator(null);
            setPrevValue(null);
            return;
          }
          result = prev / current;
          break;
        case '%':
          result = prev % current;
          break;
        case '^':
          result = Math.pow(prev, current);
          break;
        default:
          return;
      }

      // Round to avoid floating point issues
      const roundedResult = Math.round(result * 1000000000) / 1000000000;
      const resultStr = roundedResult.toString();

      setHistory([{ expression: `${prevValue} ${operator} ${display}`, result: resultStr }, ...history]);
      setDisplay(resultStr);
      setExpression(resultStr);
      setOperator(null);
      setPrevValue(null);
    } catch {
      setDisplay('Error');
      setExpression('');
      setOperator(null);
      setPrevValue(null);
    }
  };

  const handleScientificFunction = (fn: string) => {
    const current = parseFloat(display);
    let result: number;
    let fnName: string;

    try {
      switch (fn) {
        case 'sin':
          result = angleMode === 'deg' ? Math.sin(current * Math.PI / 180) : Math.sin(current);
          fnName = `sin(${current})`;
          break;
        case 'cos':
          result = angleMode === 'deg' ? Math.cos(current * Math.PI / 180) : Math.cos(current);
          fnName = `cos(${current})`;
          break;
        case 'tan':
          result = angleMode === 'deg' ? Math.tan(current * Math.PI / 180) : Math.tan(current);
          fnName = `tan(${current})`;
          break;
        case 'asin':
          result = angleMode === 'deg' ? Math.asin(current) * 180 / Math.PI : Math.asin(current);
          fnName = `asin(${current})`;
          break;
        case 'acos':
          result = angleMode === 'deg' ? Math.acos(current) * 180 / Math.PI : Math.acos(current);
          fnName = `acos(${current})`;
          break;
        case 'atan':
          result = angleMode === 'deg' ? Math.atan(current) * 180 / Math.PI : Math.atan(current);
          fnName = `atan(${current})`;
          break;
        case 'sqrt':
          result = Math.sqrt(current);
          fnName = `√(${current})`;
          break;
        case 'square':
          result = current * current;
          fnName = `(${current})²`;
          break;
        case 'log':
          result = Math.log10(current);
          fnName = `log(${current})`;
          break;
        case 'ln':
          result = Math.log(current);
          fnName = `ln(${current})`;
          break;
        case 'pow2':
          result = Math.pow(2, current);
          fnName = `2^(${current})`;
          break;
        case 'factorial':
          if (current < 0 || !Number.isInteger(current)) {
            setDisplay('Error');
            return;
          }
          result = factorial(current);
          fnName = `${current}!`;
          break;
        case 'abs':
          result = Math.abs(current);
          fnName = `|${current}|`;
          break;
        case 'pi':
          result = Math.PI;
          fnName = 'π';
          break;
        case 'e':
          result = Math.E;
          fnName = 'e';
          break;
        case 'inv':
          if (current === 0) {
            setDisplay('Error');
            return;
          }
          result = 1 / current;
          fnName = `1/${current}`;
          break;
        default:
          return;
      }

      const roundedResult = Math.round(result * 1000000000) / 1000000000;
      setDisplay(roundedResult.toString());
      setExpression(fnName);
    } catch {
      setDisplay('Error');
    }
  };

  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleEquals = () => {
    if (operator && prevValue) {
      calculate();
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setOperator(null);
    setPrevValue(null);
  };

  const handleBackspace = () => {
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handlePlusMinus = () => {
    if (display === '0' || display === 'Error') return;
    if (display.startsWith('-')) {
      setDisplay(display.slice(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setExpression(expression + '.');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(display);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        handleOperator('÷');
      } else if (e.key === '^') {
        handleOperator('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key.toLowerCase() === 's') {
        handleScientificFunction('sin');
      } else if (e.key.toLowerCase() === 'c') {
        handleScientificFunction('cos');
      } else if (e.key.toLowerCase() === 't') {
        handleScientificFunction('tan');
      } else if (e.key === 'r') {
        handleScientificFunction('sqrt');
      } else if (e.key === 'l') {
        handleScientificFunction('log');
      } else if (e.key === 'n') {
        handleScientificFunction('ln');
      } else if (e.key === 'p') {
        handleScientificFunction('pi');
      } else if (e.key === '!') {
        handleScientificFunction('factorial');
      }
    };

    window.addEventListener('keydown', handleKeyDown as EventListener);
    return () => window.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [display, expression, operator, prevValue, angleMode]);

  const ButtonConfig = {
    size: 'lg',
    fontSize: 'xl',
    fontWeight: 'medium',
    borderRadius: 'full',
    _hover: { bg: buttonHoverBg },
  };

  const OperatorButtonConfig = {
    ...ButtonConfig,
    colorScheme: 'blue',
    bg: operatorBg,
    _hover: { bg: operatorHoverBg },
  };

  const FunctionButtonConfig = {
    ...ButtonConfig,
    bg: functionBg,
    fontSize: 'md',
  };

  return (
    <Flex direction="column" h="100%" bg={bgColor}>
      {/* Header */}
      <Flex justify="space-between" align="center" p={2}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMenu />}
            variant="ghost"
            size="sm"
          />
          <MenuList>
            <MenuItem onClick={() => setMode('standard')}>Standard</MenuItem>
            <MenuItem onClick={() => setMode('scientific')}>Scientific</MenuItem>
            <MenuItem onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? 'Hide' : 'Show'} History
            </MenuItem>
            <MenuItem icon={<FiCopy />} onClick={copyResult}>
              Copy
            </MenuItem>
          </MenuList>
        </Menu>

        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.500">{mode === 'standard' ? 'Standard' : 'Scientific'}</Text>
          {mode === 'scientific' && (
            <Menu>
              <MenuButton as={Button} size="xs" variant="ghost">
                {angleMode === 'deg' ? 'DEG' : 'RAD'}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setAngleMode('deg')}>DEG (Degrees)</MenuItem>
                <MenuItem onClick={() => setAngleMode('rad')}>RAD (Radians)</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>

      {/* Display */}
      <Box px={4} pb={2}>
        <Flex justify="flex-end" align="flex-end" direction="column">
          <Text fontSize="xs" color="gray.500" minH="16px">
            {expression}
          </Text>
          <Text fontSize="4xl" fontWeight="bold">
            {display}
          </Text>
        </Flex>
      </Box>

      {/* Main Calculator */}
      <Flex flex={1} gap={2} p={2}>
        {/* History Sidebar */}
        {showHistory && (
          <Box
            w="180px"
            borderRight="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            overflowY="auto"
            pr={2}
          >
            <Text fontSize="sm" fontWeight="semibold" mb={2}>
              History
            </Text>
            {history.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                No history yet
              </Text>
            ) : (
              <VStack spacing={2} align="stretch">
                {history.map((item, index) => (
                  <Box
                    key={index}
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                    cursor="pointer"
                    onClick={() => setDisplay(item.result)}
                  >
                    <Text fontSize="xs" color="gray.500">
                      {item.expression}
                    </Text>
                    <Text fontSize="md" fontWeight="bold">
                      {item.result}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        )}

        {/* Calculator Buttons */}
        <Box flex={1}>
          {mode === 'scientific' ? (
            <Tabs variant="soft-rounded" colorScheme="blue" size="sm" h="100%">
              <TabList mb={2}>
                <Tab>Functions</Tab>
                <Tab>Constants</Tab>
              </TabList>
              <TabPanels h="calc(100% - 50px)">
                <TabPanel p={0}>
                  <Grid templateColumns="repeat(5, 1fr)" gap={2} h="100%">
                    {/* Scientific Functions Row 1 */}
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('sin')}>
                      sin
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('cos')}>
                      cos
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('tan')}>
                      tan
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('sqrt')}>
                      √
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('square')}>
                      x²
                    </Button>

                    {/* Scientific Functions Row 2 */}
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('log')}>
                      log
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('ln')}>
                      ln
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('pow2')}>
                      2ˣ
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('factorial')}>
                      x!
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('abs')}>
                      |x|
                    </Button>

                    {/* Scientific Functions Row 3 */}
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('asin')}>
                      sin⁻¹
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('acos')}>
                      cos⁻¹
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('atan')}>
                      tan⁻¹
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('pi')}>
                      π
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('e')}>
                      e
                    </Button>
                  </Grid>
                </TabPanel>
                <TabPanel p={0}>
                  <Grid templateColumns="repeat(4, 1fr)" gap={2} h="100%">
                    <Button {...FunctionButtonConfig} onClick={() => setDisplay(Math.PI.toString())}>
                      π
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => setDisplay(Math.E.toString())}>
                      e
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('inv')}>
                      1/x
                    </Button>
                    <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('pow2')}>
                      2ˣ
                    </Button>
                  </Grid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : null}

          {/* Standard Calculator Grid */}
          <Grid
            templateColumns={mode === 'scientific' ? "repeat(4, 1fr)" : "repeat(4, 1fr)"}
            gap={2}
            mt={mode === 'scientific' ? 2 : 0}
          >
            {/* Row 1 */}
            <Button {...ButtonConfig} onClick={handleClear}>
              C
            </Button>
            <Button
              {...ButtonConfig}
              onClick={handleBackspace}
              bg={buttonBg}
            >
              ⌫
            </Button>
            <Button
              {...ButtonConfig}
              onClick={() => handleOperator('%')}
              bg={buttonBg}
            >
              %
            </Button>
            <Button
              {...ButtonConfig}
              onClick={() => handleOperator('÷')}
              {...OperatorButtonConfig}
            >
              ÷
            </Button>

            {/* Row 2 */}
            <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('square')}>
              x²
            </Button>
            <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('sqrt')}>
              √
            </Button>
            <Button {...FunctionButtonConfig} onClick={() => handleScientificFunction('inv')}>
              1/x
            </Button>
            <Button
              {...ButtonConfig}
              onClick={() => handleOperator('×')}
              {...OperatorButtonConfig}
            >
              ×
            </Button>

            {/* Row 3 */}
            <Button {...ButtonConfig} onClick={() => handleNumber('7')}>
              7
            </Button>
            <Button {...ButtonConfig} onClick={() => handleNumber('8')}>
              8
            </Button>
            <Button {...ButtonConfig} onClick={() => handleNumber('9')}>
              9
            </Button>
            <Button
              {...ButtonConfig}
              onClick={() => handleOperator('-')}
              {...OperatorButtonConfig}
            >
              -
            </Button>

            {/* Row 4 */}
            <Button {...ButtonConfig} onClick={() => handleNumber('4')}>
              4
            </Button>
            <Button {...ButtonConfig} onClick={() => handleNumber('5')}>
              5
            </Button>
            <Button {...ButtonConfig} onClick={() => handleNumber('6')}>
              6
            </Button>
            <Button
              {...ButtonConfig}
              onClick={() => handleOperator('+')}
              {...OperatorButtonConfig}
            >
              +
            </Button>

            {/* Row 5 */}
            <Button {...ButtonConfig} onClick={() => handleNumber('1')}>
              1
            </Button>
            <Button {...ButtonConfig} onClick={() => handleNumber('2')}>
              2
            </Button>
            <Button {...ButtonConfig} onClick={() => handleNumber('3')}>
              3
            </Button>
            <Button
              {...ButtonConfig}
              onClick={() => handleScientificFunction('pow2')}
              {...OperatorButtonConfig}
            >
              ^
            </Button>

            {/* Row 6 */}
            <Button {...ButtonConfig} onClick={handlePlusMinus}>
              ±
            </Button>
            <Button {...ButtonConfig} onClick={() => handleNumber('0')}>
              0
            </Button>
            <Button {...ButtonConfig} onClick={handleDecimal}>
              .
            </Button>
            <Button
              {...ButtonConfig}
              onClick={handleEquals}
              {...OperatorButtonConfig}
            >
              =
            </Button>
          </Grid>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Calculator;
