const { transforms } = require('advent-of-code-client');
const sum = require('../helpers/sum');

const testData = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

const expectedResultPart1 = 127;
const expectedResultPart2 = 62;

const preambleSize = 25;

const sortAsc = (numbers) => numbers.sort((a, b) => a - b);

const isNumberValid = (numbersBefore, currNumber) => {
  // all numbers should be greater than zero, so filter out any number that is larger or equal to currNumber
  const possibleToSum = sortAsc(
    numbersBefore.filter((num) => num < currNumber)
  );

  for (let i = 0; i < possibleToSum.length - 1; i++) {
    for (let j = i + 1; j < possibleToSum.length; j++) {
      if (possibleToSum[i] === possibleToSum[j]) continue; // skip this iteration since numbers have to be different
      if (possibleToSum[i] + possibleToSum[j] > currNumber) break; // since numbers are sorted, no valid number will be found by incrementing j
      if (possibleToSum[i] + possibleToSum[j] === currNumber) return true; // found it!
    }
    if (possibleToSum[i] > currNumber / 2) return false; // since numbers are sorted, no valid number will be found after this by incrementing either i or j
  }
  // no match found
  return false;
};

const generateValidNumberChecker = (numbers) => {
  let index = 0;
  return (number) => {
    const numbersBefore = numbers.slice(index, preambleSize + index);
    const isValid = isNumberValid(numbersBefore, number);
    index++;
    return isValid;
  };
};

const findRange = (numbers, part1Res) => {
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const range = numbers.slice(i, j + 1);
      const s = sum(...range);
      if (s === part1Res) return range;
      if (s > part1Res) break;
    }
  }
  return undefined;
};

const run = async (client) => {
  client.setTestData([
    { input: testData, expectedOutput: expectedResultPart1 },
    { input: testData, expectedOutput: expectedResultPart2 }
  ]);

  client.setInputTransform(transforms.numbers);

  const part1 = (numbers) => {
    const isValidNumber = generateValidNumberChecker(numbers);
    const invalidNum = numbers
      .slice(preambleSize)
      .find((num) => !isValidNumber(num));
    return invalidNum;
  };

  const part2 = (numbers) => {
    const x = part1(numbers);
    const possibleNumbers = numbers.filter((num) => num < x);
    const range = findRange(possibleNumbers, x);
    const sortedRange = sortAsc(range);
    const min = sortedRange[0];
    const max = sortedRange[sortedRange.length - 1];
    return min + max;
  };

  const res = await client.test([part1, part2]);
  console.log('results:', res);
};

module.exports = {
  run
};
