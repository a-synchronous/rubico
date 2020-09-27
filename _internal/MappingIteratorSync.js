const symbolIterator = require('./symbolIterator')

/**
 * @name MappingIteratorSync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * MappingIteratorSync<
 *   T any,
 *   iterator Iterator<T>,
 *   mapper T=>any,
 * >(iterator, mapper) -> MappingIteratorSync Object
 *
 * MappingIteratorSync.next() -> nextIteration { value: any, done: boolean }
 * ```
 *
 * @description
 * Create a mapping iterator that applies a mapper to each item of a source iterator. Promises are not automatically resolved.
 *
 * Note: consuming the mapping iterator also consumes the source iterator.
 */
const MappingIteratorSync = (iterator, mapper) => ({
  toString() {
    return '[object MappingIteratorSync]'
  },
  [symbolIterator]() {
    return this
  },
  next() {
    const iteration = iterator.next()
    return iteration.done ? iteration
      : { value: mapper(iteration.value), done: false }
  },
})

module.exports = MappingIteratorSync
