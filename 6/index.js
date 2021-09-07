const { transforms } = require('advent-of-code-client');

const run = async (client) => {
  client.setInputTransform(transforms.splitBy('\n\n'));

  const countUniqueAnswers = (answers) => [...new Set(answers)].length;
  const part1 = (rawAnswers) => {
    const answersPerGroup = rawAnswers.map((groupAnswers) =>
      [].concat(...groupAnswers.split('\n').map((a) => a.split('')))
    );
    const uniqueAnswers = answersPerGroup
      .map(countUniqueAnswers)
      .reduce((acc, uniqueAnswersCount) => acc + uniqueAnswersCount, 0);
    return uniqueAnswers;
  };

  const part2 = (rawAnswers) => {
    const answersPerGroup = rawAnswers.map((groupAnswers) =>
      groupAnswers.split('\n').map((a) => a.split(''))
    );
    const countOfAllYesAnswersPerGroup = answersPerGroup.map((groupAnswers) => {
      const firstPersonAnswers = groupAnswers[0];
      return firstPersonAnswers.reduce((acc, answer) => {
        if (groupAnswers.slice(1).every((answers) => answers.includes(answer)))
          return acc + 1;
        return acc;
      }, 0);
    });
    const numberOfAllYesAnswers = countOfAllYesAnswersPerGroup.reduce(
      (acc, count) => acc + count,
      0
    );
    return numberOfAllYesAnswers;
  };

  await client.run([part1, part2], true);
};

module.exports = {
  run
};
