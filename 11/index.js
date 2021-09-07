const { transforms } = require('advent-of-code-client');

const OCCUPIED = '#';
const EMPTY = 'L';
const FLOOR = '.';

const test = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

const run = async (client) => {
  client.setInputTransform((data) =>
    transforms.lines(data).map(transforms.splitBy(''))
  );

  const countSeatsWithState = (state, seats) =>
    seats.reduce(
      (count, position) => (position === state ? count + 1 : count),
      0
    );

  const getAdjacentSeats = (rows, rowIndex, columnIndex) => {
    const upperRow = rows[rowIndex - 1];
    const lowerRow = rows[rowIndex + 1];
    const seatsOnUpperRow = upperRow
      ? upperRow.slice(Math.max(columnIndex - 1, 0), columnIndex + 2)
      : [];
    const seatsOnSameRow = [
      rows[rowIndex][columnIndex - 1],
      rows[rowIndex][columnIndex + 1]
    ];
    const seatsOnLowerRow = lowerRow
      ? lowerRow.slice(Math.max(columnIndex - 1, 0), columnIndex + 2)
      : [];
    return [...seatsOnUpperRow, ...seatsOnSameRow, ...seatsOnLowerRow];
  };

  const updateGridUntilNoMoreChanges = (grid, update) => {
    let updatedGrid = grid;
    let changed = true;

    // console.log(grid.map((row) => row.join('')).join('\n'));

    while (changed === true) {
      let prev = updatedGrid;
      updatedGrid = update(updatedGrid);
      changed = JSON.stringify(prev) !== JSON.stringify(updatedGrid);
      // console.log(updatedGrid.map((row) => row.join('')).join('\n'));
    }

    return updatedGrid;
  };

  const part1 = (grid) => {
    const updateGrid = (g) =>
      g.map((row, rowIndex, rows) =>
        row.map((position, columnIndex) => {
          const adjacentSeats = getAdjacentSeats(rows, rowIndex, columnIndex);
          if (
            position === EMPTY &&
            countSeatsWithState(OCCUPIED, adjacentSeats) === 0
          ) {
            return OCCUPIED;
          }
          if (
            position === OCCUPIED &&
            countSeatsWithState(OCCUPIED, adjacentSeats) >= 4
          ) {
            return EMPTY;
          }
          return position;
        })
      );

    const updatedGrid = updateGridUntilNoMoreChanges(grid, updatedGrid);

    const flattenedGrid = [].concat(...updatedGrid);
    const numberOfOccupied = countSeatsWithState(OCCUPIED, flattenedGrid);
    return numberOfOccupied;
  };

  const part2 = (grid) => {
    const findVisible = (seats) =>
      seats.find((seat) => seat === OCCUPIED || seat === EMPTY);

    const getVisibleSeats = (rows, rowIndex, columnIndex) => {
      const upwards = rows.slice(0, rowIndex).map((row) => row[columnIndex]);
      upwards.reverse();
      // console.log('upwards:', upwards);
      const visibleUp = findVisible(upwards);

      const downWards = rows.slice(rowIndex + 1).map((row) => row[columnIndex]);
      // console.log('downWards:', downWards);
      const visibleDown = findVisible(downWards);

      const leftWards = rows[rowIndex].slice(0, columnIndex);
      leftWards.reverse();
      const visibleLeft = findVisible(leftWards);
      // console.log('leftWards:', leftWards);

      const rightWards = rows[rowIndex].slice(columnIndex + 1);
      const visibleRight = findVisible(rightWards);
      // console.log('rightWards:', rightWards);

      const rowsAbove = rows.slice(0, rowIndex);
      rowsAbove.reverse();
      const diagonallyLeftUpWards = rowsAbove.map(
        (row, index) => row[columnIndex - (index + 1)]
      );
      // console.log('diagonallyLeftUpWards:', diagonallyLeftUpWards);
      const visibleLeftUpDiagonally = findVisible(diagonallyLeftUpWards);
      const diagonallyRightUpWards = rowsAbove.map(
        (row, index) => row[columnIndex + index + 1]
      );
      // console.log('diagonallyRightUpWards:', diagonallyRightUpWards);
      const visibleRightUpDiagonally = findVisible(diagonallyRightUpWards);

      const rowsBelow = rows.slice(rowIndex + 1);
      const diagonallyLeftDownWards = rowsBelow.map(
        (row, index) => row[columnIndex - (index + 1)]
      );
      // console.log('diagonallyLeftDownWards:', diagonallyLeftDownWards);
      const visibleLeftDownDiagonally = findVisible(diagonallyLeftDownWards);
      const diagonallyRightDownWards = rowsBelow.map(
        (row, index) => row[columnIndex + index + 1]
      );
      // console.log('diagonallyRightDownWards:', diagonallyRightDownWards);
      const visibleRightDownDiagonally = findVisible(diagonallyRightDownWards);

      //  console.log({
      //   visibleLeft,
      //   visibleUp,
      //   visibleRight,
      //   visibleDown,
      //   visibleLeftUpDiagonally,
      //   visibleRightUpDiagonally,
      //   visibleRightDownDiagonally,
      //   visibleLeftDownDiagonally
      // });

      return [
        visibleLeft,
        visibleUp,
        visibleRight,
        visibleDown,
        visibleLeftUpDiagonally,
        visibleRightUpDiagonally,
        visibleRightDownDiagonally,
        visibleLeftDownDiagonally
      ];
    };

    const updateGrid = (g) =>
      g.map((row, rowIndex, rows) =>
        row.map((position, columnIndex) => {
          const visibleSeats = getVisibleSeats(rows, rowIndex, columnIndex);
          if (
            position === EMPTY &&
            countSeatsWithState(OCCUPIED, visibleSeats) === 0
          ) {
            return OCCUPIED;
          }
          if (
            position === OCCUPIED &&
            countSeatsWithState(OCCUPIED, visibleSeats) >= 5
          ) {
            return EMPTY;
          }
          return position;
        })
      );

    const updatedGrid = updateGridUntilNoMoreChanges(grid, updateGrid);

    const flattenedGrid = [].concat(...updatedGrid);
    const numberOfOccupied = countSeatsWithState(OCCUPIED, flattenedGrid);
    return numberOfOccupied;
  };

  await client.run([part1, part2]);
};

module.exports = {
  run
};
