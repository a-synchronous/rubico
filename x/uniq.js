const Instance = require('../monad/Instance');

const { isArray } = Instance;

const { reduce } = require('../index');

const uniq = (arr) => {
  if (!isArray(arr)) throw Error('uniq(arr): arr is not an array');
  
  const seenSet = new Set();
  return reduce((acc, value) => {
    if (seenSet.has(value)) {
      return acc;
    } 
    seenSet.add(value);
    return [...acc, value];
  }, [])(arr);
};

module.exports = uniq;
