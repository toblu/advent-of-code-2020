const sum = require('./sum');

const sumsTo = (x) => (...args) => sum(...args) === x;

module.exports = sumsTo;
