const symbolIterator = require('./symbolIterator')

/**
 * @name MappingIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * MappingIterator<
 *   T any,
 *   iterator Iterator<T>,
 *   mapper T=>any,
 * >(iterator, mapper) -> mappingIterator Object
 *
 * mappingIterator.next() -> nextIteration { value: any, done: boolean }
 * ```
 *
 * @description
 * Creates a mapping iterator, i.e. an iterator that applies a mapper to each item of a source iterator.
 *
 * Note: consuming the mapping iterator also consumes the source iterator.
 */
const MappingIterator = (iterator, mapper) => ({
  toString() {
    return '[object MappingIterator]'
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

module.exports = MappingIterator
