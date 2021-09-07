const { transforms } = require('advent-of-code-client');

const parseInstruction = (instruction) => {
  const [inst, inc] = instruction.split(' ');
  return [inst, parseInt(inc)];
};

const run = async (client) => {
  client.setInputTransform((data) =>
    transforms.lines(data).map(parseInstruction)
  );

  const runInstructions = (instructions) => {
    let accumulator = 0;
    let i = 0;
    let previouslyExecuted = [];

    while (i >= 0 && i < instructions.length) {
      if (previouslyExecuted[i]) {
        // prevent infinite loop
        return [accumulator, true];
      }
      previouslyExecuted[i] = true;
      const [action, inc] = instructions[i];
      if (action === 'acc') {
        // accumulate
        accumulator += inc;
        i += 1;
        continue;
      }
      if (action === 'jmp') {
        // jump
        i += inc;
        continue;
      }
      // noop
      i += 1;
    }

    return [accumulator, false];
  };

  const part1 = (instructions) => {
    const [accumulator] = runInstructions(instructions);
    return accumulator;
  };

  const part2 = (instructions) => {
    const isNopOrJmpAction = ([action]) => ['nop', 'jmp'].includes(action);

    const modifyAction = ([action, inc]) => {
      if (action === 'nop') return ['jmp', inc];
      if (action === 'jmp') return ['nop', inc];
      throw new Error(
        `Unexpected action "${action}", can only modify "nop" or "jmp"`
      );
    };

    let lastInstructionModified;

    const lastNopOrJmpIndex = (() => {
      const indexFromLast = [...instructions]
        .reverse()
        .findIndex(isNopOrJmpAction);
      if (indexFromLast === -1) return -1;
      return instructions.length - (indexFromLast + 1);
    })();

    const changeNextNopOrJmp = (instructions) => {
      const unmodifiedInstructions =
        lastInstructionModified !== undefined
          ? instructions.slice(0, lastInstructionModified + 1)
          : [];
      const newInstructions = instructions.slice(lastInstructionModified + 1);
      const nextNopOrJmpIndex = newInstructions.findIndex(isNopOrJmpAction);
      if (nextNopOrJmpIndex > -1) {
        newInstructions[nextNopOrJmpIndex] = modifyAction(
          newInstructions[nextNopOrJmpIndex]
        );
        lastInstructionModified =
          lastInstructionModified !== undefined
            ? lastInstructionModified + nextNopOrJmpIndex + 1
            : nextNopOrJmpIndex;
      }

      return [...unmodifiedInstructions, ...newInstructions];
    };

    while (
      !lastInstructionModified ||
      lastInstructionModified < lastNopOrJmpIndex
    ) {
      const modifiedInstructions = changeNextNopOrJmp(instructions);
      const [accumulator, infiniteLoop] = runInstructions(modifiedInstructions);
      if (!infiniteLoop) {
        return accumulator;
      }
    }
  };

  await client.run([part1, part2]);
};

module.exports = {
  run
};
