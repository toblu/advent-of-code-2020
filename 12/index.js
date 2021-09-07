const { transforms } = require('advent-of-code-client');
const { to } = require('mathjs');
const math = require('mathjs');

const test = `F10
N3
F7
R90
F11`;

const toRadians = (deg) => (deg * Math.PI) / 180;

const run = async (client) => {
  client.setInputTransform((data) =>
    transforms.lines(data).map((instruction) => ({
      direction: instruction.substring(0, 1),
      units: parseInt(instruction.substring(1))
    }))
  );

  const calculateManhattanDistance = (dN, dE) => {
    return Math.abs(Math.round(dN)) + Math.abs(Math.round(dE));
  };

  const part1 = (instructions) => {
    let degrees = 90; // start by facing east
    let dN = 0;
    let dE = 0;

    const updatePosAndDirection = ({ direction, units }) => {
      if (direction === 'F') {
        dN += units * Math.cos(toRadians(degrees));
        dE += units * Math.sin(toRadians(degrees));
      } else if (['N', 'S'].includes(direction)) {
        const symbol = direction === 'N' ? 1 : -1;
        dN += symbol * units;
      } else if (['E', 'W'].includes(direction)) {
        const symbol = direction === 'E' ? 1 : -1;
        dE += symbol * units;
      } else if (['R', 'L'].includes(direction)) {
        const symbol = direction === 'R' ? 1 : -1;
        degrees += symbol * units;
      }
    };

    instructions.forEach((instruction) => updatePosAndDirection(instruction));

    return calculateManhattanDistance(dN, dE);
  };

  // const part2 = (instructions) => {
  //   const wp = {
  //     dN: 1,
  //     dE: 10
  //   };

  //   let dN = 0;
  //   let dE = 0;

  //   const updateWayPoint = ({ direction, units }) => {
  //     if (['N', 'S'].includes(direction)) {
  //       const symbol = direction === 'N' ? 1 : -1;
  //       wp.dN += symbol * units;
  //     } else if (['E', 'W'].includes(direction)) {
  //       const symbol = direction === 'E' ? 1 : -1;
  //       wp.dE += symbol * units;
  //     } else if (['R', 'L'].includes(direction)) {
  //       const symbol = direction === 'R' ? 1 : -1;
  //       const hyp = Math.sqrt(Math.pow(wp.dN, 2) + Math.pow(wp.dE, 2));
  //       wp.dN =
  //         hyp * Math.cos(Math.acos(wp.dN / hyp) + symbol * toRadians(units));
  //       wp.dE =
  //         hyp * Math.sin(Math.asin(wp.dE / hyp) + symbol * toRadians(units));
  //     }
  //   };

  //   const updatePos = ({ direction, units }) => {
  //     if (direction === 'F') {
  //       for (let i = 0; i < units; i++) {
  //         dN += wp.dN;
  //         dE += wp.dE;
  //       }
  //     }
  //   };

  //   instructions.forEach((instruction) => {
  //     if (instruction.direction === 'F') updatePos(instruction);
  //     else updateWayPoint(instruction);
  //   });

  //   return calculateManhattanDistance(dN, dE);
  // };

  const p2 = (instructions) => {
    let wp = math.Complex(10, 1);
    let sum = math.Complex.fromPolar(0, 0);

    instructions.forEach(({ direction, units }) => {
      if (direction === 'R') {
        wp = math.multiply(wp, math.Complex.fromPolar(1, toRadians(-units)));
      } else if (direction === 'L') {
        wp = math.multiply(wp, math.Complex.fromPolar(1, toRadians(units)));
      } else if (direction === 'F') {
        sum = math.add(sum, math.multiply(units, wp));
      } else if (direction === 'N') {
        wp = math.add(wp, math.Complex.fromPolar(units, toRadians(90)));
      } else if (direction === 'S') {
        wp = math.add(wp, math.Complex.fromPolar(units, toRadians(270)));
      } else if (direction === 'E') {
        wp = math.add(wp, math.Complex.fromPolar(units, toRadians(0)));
      } else if (direction === 'W') {
        wp = math.add(wp, math.Complex.fromPolar(units, toRadians(180)));
      }
    });
    return calculateManhattanDistance(sum.re + sum.im);
  };

  const part2 = (instructions) => {
    const correctAnswer = p2(instructions);

    let wp = math.complex(10, 1).toPolar(); // initial waypoint pos
    let pos = math.complex(0, 0).toPolar(); // starting pos

    instructions.forEach(({ direction, units }) => {
      if (['N', 'S'].includes(direction)) {
        const symbol = direction === 'N' ? 1 : -1;
        wp = math.add(wp, math.complex(0, symbol * units).toPolar());
      } else if (['E', 'W'].includes(direction)) {
        const symbol = direction === 'E' ? 1 : -1;
        wp = math.add(wp, math.complex(symbol * units, 0).toPolar());
      } else if (['R', 'L'].includes(direction)) {
        const symbol = direction === 'R' ? -1 : 1;
        wp = math.multiply(
          wp,
          math.complex(1, symbol * toRadians(units)).toPolar()
        );
      } else {
        // pos = units * wp;
      }
    });

    pos = pos.fromPolar();

    const calculatedAnswer = calculateManhattanDistance(pos.re, pos.im);
    console.log('Correct answer', correctAnswer);
    console.log('Calculated answer', calculatedAnswer);
    return calculatedAnswer;
  };

  await client.run([part1, part2]);
};

module.exports = {
  run
};
