const symbolIterator = require('./symbolIterator')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const asyncIteratorForEach = require('./asyncIteratorForEach')

/**
 * @name iteratorForEach
 *
 * @synopsis
 * iteratorForEach<
 *   T any,
 *   iterator Iterator<Promise|T>,
 *   callback T=>(),
 * >(iterator, callback) -> ()
 *
 * @description
 * Call a callback for each item of an iterator.
 *
 * Note: iterator is consumed
 */
const iteratorForEach = function (iterator, callback) {
  if (typeof iterator[symbolIterator] == 'function') {
    for (const item of iterator) {
      callback(item)
    }
  } else {
    return asyncIteratorForEach(iterator, callback)
  }
}

module.exports = iteratorForEach
