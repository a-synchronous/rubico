const Instance = require('../monad/Instance');

const { isArray } = Instance;

const { reduce } = require('../index');

/**
 * @name uniq
 *
 * @synopsis
 * <T any>uniq(arr Array<T>) -> uniqArr Array<T>
 *
 * @catchphrase
 * Get unique values of a collection
 *
 * @description
 * `uniq` takes an Array of items and returns an Array of items containing only the unique items of that Array.
 *
 * @example
 * console.log(
 *   uniq([1, 2, 2, 3]),
 * ) // [1, 2, 3]
 */
const uniq = arr => {
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
