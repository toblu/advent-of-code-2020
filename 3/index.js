const { transforms } = require('advent-of-code-client');

const run = async (client) => {
  client.setInputTransform((data) =>
    transforms.lines(data).map((line) => line.split(''))
  );

  const isTree = (x) => x === '#';

  const traverseAndCount = (
    remainingMap,
    stepRight,
    stepDown,
    currRight = 0,
    currCount = 0
  ) => {
    if (!remainingMap.length) return currCount;
    const isTreeInPos = isTree(remainingMap[0][currRight]);
    const newCount = isTreeInPos ? currCount + 1 : currCount;
    const newRight = (() => {
      if (currRight < remainingMap[0].length - stepRight)
        return currRight + stepRight;
      return currRight + stepRight - remainingMap[0].length;
    })();

    return traverseAndCount(
      remainingMap.slice(stepDown),
      stepRight,
      stepDown,
      newRight,
      newCount
    );
  };

  const part1 = (map) => traverseAndCount(map, 3, 1);
  const part2 = (map) =>
    [
      traverseAndCount(map, 1, 1),
      traverseAndCount(map, 3, 1),
      traverseAndCount(map, 5, 1),
      traverseAndCount(map, 7, 1),
      traverseAndCount(map, 1, 2)
    ].reduce((acc, count) => acc * count, 1) + 1;

  await client.run([part1, part2]);
};

module.exports = {
  run
};
