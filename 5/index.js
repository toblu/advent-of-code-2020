const { transforms } = require('advent-of-code-client');

const run = async (client) => {
  client.setInputTransform((rawData) => {
    const boardingPasses = transforms.lines(rawData);
    const parseBoardingPass = (boardingPass) => {
      const rowIndicators = boardingPass.substring(0, 7);
      const columnIndicators = boardingPass.substring(7);
      return [rowIndicators.split(''), columnIndicators.split('')];
    };

    const splitRangeByIndicator = (lowerHalfIndicator) => (
      range,
      indicator
    ) => {
      const lower = indicator === lowerHalfIndicator;
      if (lower) {
        return [range[0], range[1] - Math.floor((range[1] - range[0]) / 2) - 1];
      }
      return [range[0] + Math.ceil((range[1] - range[0]) / 2), range[1]];
    };

    const calculatePositionFromRange = (
      indicators,
      initialRange,
      lowerHalfIndicator
    ) => {
      const lastIndicator = indicators.pop();
      const remainingTwoPositions = indicators.reduce(
        splitRangeByIndicator(lowerHalfIndicator),
        initialRange
      );
      return lastIndicator === lowerHalfIndicator
        ? remainingTwoPositions[0]
        : remainingTwoPositions[1];
    };

    const findSeats = (boardingPass) => {
      const [rowIndicators, columnIndicators] = parseBoardingPass(boardingPass);
      const row = calculatePositionFromRange(rowIndicators, [0, 127], 'F');
      const column = calculatePositionFromRange(columnIndicators, [0, 7], 'L');
      return [row, column];
    };

    return boardingPasses.map(findSeats);
  });

  const calculateSeatId = ([row, column]) => row * 8 + column;

  const part1 = (seats) => {
    return seats.map(calculateSeatId).sort((a, b) => b - a)[0];
  };

  const part2 = (seats) => {
    const excludeSeatsOnFirstAndLastRow = (allSeats) =>
      allSeats.filter(([row]) => row !== 0 && row !== 127);

    const findEmptySeatId = (possibleSeats) => {
      const seatIds = possibleSeats.map(calculateSeatId).sort((a, b) => a - b);
      for (let i = 0; i < seatIds.length - 1; i++) {
        const currSeatId = seatIds[i];
        const nextSeatId = seatIds[i + 1];
        const diff = nextSeatId - currSeatId;
        if (diff === 2) {
          return currSeatId + 1;
        }
      }
    };

    const possibleSeats = excludeSeatsOnFirstAndLastRow(seats);

    return findEmptySeatId(possibleSeats);
  };

  await client.run([part1, part2]);
};

module.exports = {
  run
};
