const sort = (arr, direction = 'ASC') =>
  direction === 'ASC' ? arr.sort((a, b) => a - b) : arr.sort((a, b) => b - a);

module.exports = sort;
