const findAllIndexes = (predicate, arr) =>
  arr.reduce((acc, element, index) => {
    if (predicate(element) === true) return [...acc, index];
    return acc;
  }, []);

module.exports = findAllIndexes;
