const { transforms } = require('advent-of-code-client');

const run = async (client) => {
  client.setInputTransform((rawData) => {
    const rawPassports = transforms.lines(rawData);

    return rawPassports.reduce((passports, value, index) => {
      if (value === '' && index !== rawPassports.length - 1) {
        // if value is an empty string and not last element of original array,
        // it means that there are no more fields for previous passport and we should append another empty passport to the list.
        return [...passports, {}];
      }
      const fields = value.split(' ');
      if (fields.length) {
        // Add more fields to previous passport
        const mappedFields = fields.reduce((accFields, keyValueStr) => {
          const [key, value] = keyValueStr.split(':');
          return {
            ...accFields,
            [key]: value
          };
        }, {});
        const passportsCopy = passports.slice();
        const lastPassport = passportsCopy.pop();
        return [...passportsCopy, { ...lastPassport, ...mappedFields }];
      }
      return passports;
    }, []);
  });

  const part1 = (mappedPassports) => {
    const countValidPassports = (passports) => {
      const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
      return passports.filter((fields) =>
        requiredFields.every((field) => Object.keys(fields).includes(field))
      ).length;
    };
    return countValidPassports(mappedPassports);
  };

  const part2 = (mappedPassports) => {
    const isBetween = (start, end) => (x) => x >= start && x <= end;
    const parseValidYear = (year) => {
      if (year.length !== 4) return undefined;
      const parsedYear = parseInt(year, 10);
      return parsedYear > 1000 ? parsedYear : undefined;
    };
    const isValidYearBetween = (startYear, endYear) => (yearX) => {
      const year = parseValidYear(yearX);
      if (!year) return false;
      return isBetween(startYear, endYear)(year);
    };

    const countValidPassports = (passports) => {
      const requiredFieldsWithRules = [
        {
          key: 'byr',
          isValid: isValidYearBetween(1920, 2002)
        },
        {
          key: 'iyr',
          isValid: isValidYearBetween(2010, 2020)
        },
        { key: 'eyr', isValid: isValidYearBetween(2020, 2030) },
        {
          key: 'hgt',
          isValid: (value) => {
            if (!value.match(/^(\d{2}in|\d{3}cm)$/)) return false;
            if (value.endsWith('cm')) {
              // height in 'cm'
              const height = value.substring(0, 3);
              return isBetween(150, 193)(parseInt(height, 10));
            }
            // height in 'in'
            const height = value.substring(0, 2);
            return isBetween(59, 76)(height);
          }
        },
        { key: 'hcl', isValid: (value) => !!value.match(/^#([a-f]|\d){6}$/) },
        {
          key: 'ecl',
          isValid: (value) => !!value.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/)
        },
        {
          key: 'pid',
          isValid: (value) => !!value.match(/^\d{9}$/)
        }
      ];
      return passports.filter((fields) =>
        requiredFieldsWithRules.every(
          ({ key, isValid }) =>
            Object.keys(fields).includes(key) && isValid(fields[key])
        )
      ).length;
    };
    return countValidPassports(mappedPassports);
  };

  await client.run([part1, part2], true);
};

module.exports = { run };
