const { transforms } = require('advent-of-code-client');
const findAllIndexes = require('../helpers/findAllIndexes');
const isBetween = require('../helpers/isBetween');
const sort = require('../helpers/sort');
const sum = require('../helpers/sum');

const isBetween1And3 = isBetween(1, 3);
const diffBetween1And3 = (x, y) => isBetween1And3(y - x);

const run = async (client) => {
  client.setInputTransform((input) => sort(transforms.numbers(input)));

  const part1 = (sortedNumbers) => {
    const countDiffOf = (x, numbers) =>
      numbers.reduce((acc, curr, i, arr) => {
        if (i === 0) return curr - 0 === x; // using 0 here since the first adapter connects to the charging outlet with rating 0
        if (curr - arr[i - 1] === x) return acc + 1;
        return acc;
      }, 0);
    const diffOf1 = countDiffOf(1, sortedNumbers);
    const diffOf3 = countDiffOf(3, sortedNumbers) + 1; // the device always has a rating of 3 higher than the highest in the list
    return diffOf1 * diffOf3;
  };

  const part2 = (sortedNumbers) => {
    const choices = sortedNumbers.reduce(
      (acc, currValue) => {
        const previousElements = acc.slice(-3);
        const indexes = findAllIndexes(
          ({ value }) => diffBetween1And3(value, currValue),
          previousElements
        );
        return [
          ...acc,
          {
            count: sum(
              ...indexes.map((index) => previousElements[index].count)
            ),
            value: currValue
          }
        ];
      },
      [{ count: 1, value: 0 }]
    );
    return choices[choices.length - 1].count;
  };

  await client.run([part1, part2]);
};

module.exports = {
  run
};
