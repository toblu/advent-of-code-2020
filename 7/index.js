const { transforms } = require('advent-of-code-client');

const run = async (client) => {
  client.setInputTransform((data) => {
    const rawRules = transforms.lines(data);
    const processRule = (rawRule) => {
      const [typeOfBag, canContain] = rawRule.split('contain');
      const type = typeOfBag.replace('bags', '').trim();
      if (canContain.includes('no other bags')) {
        return {
          type,
          allowedBags: []
        };
      }
      const allowedBags = canContain.split(', ').map((quantityAndType) => {
        const quantity = parseInt(quantityAndType);
        const type = quantityAndType.replace(/\d+ /, '').split('bag')[0].trim();

        return {
          type,
          quantity
        };
      });
      return {
        type,
        allowedBags
      };
    };

    return rawRules.map(processRule).reduce(
      (acc, { type, allowedBags }) => ({
        ...acc,
        [type]: allowedBags
      }),
      {}
    );
  });

  const part1 = (rules) => {
    const canContainShinyGold = (type) => {
      return rules[type].some(
        (allowed) =>
          (allowed.type === 'shiny gold' && allowed.quantity > 0) ||
          canContainShinyGold(allowed.type)
      );
    };
    return Object.keys(rules).reduce((count, type) => {
      if (canContainShinyGold(type)) return count + 1;
      return count;
    }, 0);
  };

  const part2 = (rules) => {
    const numberOfBagsRequiredIn = (type) => {
      return rules[type].reduce((acc, allowed) => {
        return (
          acc +
          allowed.quantity +
          allowed.quantity * numberOfBagsRequiredIn(allowed.type)
        );
      }, 0);
    };
    return numberOfBagsRequiredIn('shiny gold');
  };

  await client.run([part1, part2]);
};

module.exports = {
  run
};
