const { transforms } = require('advent-of-code-client');

const run = async (client) => {
  client.setInputTransform(transforms.lines);

  const part1 = (rawPasswords) => {
    const countOccurrences = (char, str) => str.split(char).length - 1;
    const isBetweenMinMax = (min, max, x) => x >= min && x <= max;
    const parsePasswordInput = (input) => {
      const [minMax, char, password] = input.split(' ');
      return {
        min: minMax.split('-')[0],
        max: minMax.split('-')[1],
        char: char.split(':')[0],
        password
      };
    };
    const isValidPassword = ({ min, max, char, password }) =>
      isBetweenMinMax(min, max, countOccurrences(char, password));

    const passwords = rawPasswords.map(parsePasswordInput);
    const numberOfValidPasswords = passwords.filter(isValidPassword).length;
    return numberOfValidPasswords;
  };

  const part2 = (rawPasswords) => {
    const parsePasswordInput = (input) => {
      const [indices, char, password] = input.split(' ');
      return {
        firstIndex: indices.split('-')[0] - 1,
        secondIndex: indices.split('-')[1] - 1,
        char: char.split(':')[0],
        password
      };
    };

    const isValidPassword = ({ firstIndex, secondIndex, char, password }) => {
      const charAtFirstIndex = password[firstIndex];
      const charAtSecondIndex = password[secondIndex];
      return (
        charAtFirstIndex !== charAtSecondIndex &&
        (charAtFirstIndex === char || charAtSecondIndex === char)
      );
    };

    const passwords = rawPasswords.map(parsePasswordInput);
    const numberOfValidPasswords = passwords.filter(isValidPassword).length;
    return numberOfValidPasswords;
  };

  await client.run([part1, part2], true);
};

module.exports = {
  run
};
