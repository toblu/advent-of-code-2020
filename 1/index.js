const { transforms } = require('advent-of-code-client');
const multiply = require('../helpers/multiply');

const sumsTo2020With = (a) => (b) => a + b === 2020;

const run = async (client) => {
  client.setInputTransform(transforms.numbers);

  const part1 = (expenses) => {
    const findTwoValuesThatSumTo2020 = (values) => {
      const a = values.reduce((acc, value) => {
        // the value has already been found, in that case just return it
        if (acc) return acc;
        const foundValue = values.find(sumsTo2020With(value));
        return foundValue ? foundValue : null;
      }, null);
      const b = values.find(sumsTo2020With(a));
      return [a, b];
    };

    const [a, b] = findTwoValuesThatSumTo2020(expenses);
    return multiply(a, b);
  };

  const part2 = (expenses) => {
    const findThreeValuesThatSumTo2020 = (values) => {
      for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values.length; j++) {
          for (let k = 0; k < values.length; k++) {
            if (values[i] + values[j] + values[k] === 2020) {
              return [values[i], values[j], values[k]];
            }
          }
        }
      }
    };

    const [x, y, z] = findThreeValuesThatSumTo2020(expenses);
    return multiply(x, y, z);
  };

  await client.run([part1, part2], true);
};

module.exports = {
  run
};
