const symbolIterator = require('./symbolIterator')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const iterationMap = require('./iterationMap')
const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry2 = require('./curry2')

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
const MappingIterator = function (iterator, mapper) {
  const __iterationMap = curry2(iterationMap, __, mapper)
  return {
    toString() {
      return '[object MappingIterator]'
    },
    [symbolAsyncIterator]() {
      return this
    },
    [symbolIterator]() {
      return this
    },
    next() {
      const iteration = iterator.next()
      return isPromise(iteration) ? iteration.then(__iterationMap)
        : iteration.done ? iteration
        : { value: mapper(iteration.value), done: false }
    },
  }
}

console.log(MappingIterator().toString())

module.exports = MappingIterator
