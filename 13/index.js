const { transforms } = require('advent-of-code-client');
const multiply = require('../helpers/multiply');

const test = `939
1789,37,47,1889`;

const run = async (client) => {
  client.setInputTransform((data) => {
    const [timestamp, departures] = transforms.lines(data);
    return [
      +timestamp,
      departures.split(',').map((time) => {
        if (Number.isNaN(+time)) return Infinity;
        return +time;
      })
    ];
  });

  const part1 = ([timestamp, departures]) => {
    const waitingTimesFromTimestamp = departures.map((d) => ({
      id: d,
      remainder: d - (timestamp % d)
    }));
    const earliestDeparture = waitingTimesFromTimestamp.reduce(
      (earliest, curr) =>
        curr.remainder < earliest.remainder ? curr : earliest,
      { id: null, remainder: Infinity }
    );
    return multiply(...Object.values(earliestDeparture));
  };

  const part2 = ([_, departures]) => {
    console.log(Number.MAX_SAFE_INTEGER);
    const modInv = (a, m) => {
      let m0 = m;
      let x0 = 0n;
      let x1 = 1n;

      if (m == 1n) {
        return 0n;
      }

      // Apply extended Euclid Algorithm
      while (a > 1) {
        let q = a / m;
        let t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
      }

      // Make x1 positive
      if (x1 < 0n) x1 += m0;

      return x1;
    };
    // Chinese Remainder Theorem
    const solveCRT = (requiredWaitingTimes) => {
      const prod = requiredWaitingTimes.reduce(
        (acc, { id }) => (acc *= id),
        1n
      );
      const num = (i) => requiredWaitingTimes[i].id;
      const rem = (i) => requiredWaitingTimes[i].remainder;
      const pp = (i) => prod / num(i);
      const inv = (i) => modInv(pp(i), num(i));

      const result = requiredWaitingTimes.reduce(
        (acc, _, i) => acc + rem(i) * pp(i) * inv(i),
        0n
      );
      return result % prod;
    };

    const requiredWaitingTimesFromTimestamp = departures
      .map((d, i) => {
        if (d === Infinity) {
          return {
            id: d,
            remainder: null
          };
        }
        return {
          id: BigInt(d),
          remainder: i === 0 ? 0n : BigInt(Math.abs(d - i))
        };
      })
      .filter((d) => d.remainder !== null);

    return solveCRT(requiredWaitingTimesFromTimestamp);

    // //   console.log({ requiredWaitingTimesFromTimestamp });

    // //   const step = multiply(
    // //     ...requiredWaitingTimesFromTimestamp.map(({ id }) => id)
    // //   );

    // //   console.log(step);

    // const { solution } = requiredWaitingTimesFromTimestamp.reduce(
    //   (acc, curr) => {
    //     let test = acc.solution;
    //     const multiplier = acc.multiplier;
    //     while (true) {
    //       if (curr.remainder === 0)
    //         return {
    //           solution: curr.id,
    //           multiplier: curr.id
    //         };
    //       if (
    //         curr.remainder > 0 &&
    //         curr.id - (test % curr.id) === curr.remainder
    //       ) {
    //         return {
    //           solution: test,
    //           multiplier: multiplier * curr.id
    //         };
    //       }
    //       test += multiplier;
    //       // test += step;
    //     }
    //   },
    //   { multiplier: 1n, solution: 0n }
    // );

    // return solution;
  };

  // };

  await client.run([part1, part2]);
};

module.exports = {
  run
};
