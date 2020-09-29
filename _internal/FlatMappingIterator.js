const genericReduce = require('./genericReduce')
const symbolIterator = require('./symbolIterator')
const arrayPush = require('./arrayPush')

/**
 * @name FlatMappingIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * FlatMappingIterator(
 *   iterator Iterator, flatMapper function,
 * ) -> FlatMappingIterator { next, SymbolIterator }
 * ```
 */
const FlatMappingIterator = function (iterator, flatMapper) {
  let buffer = [],
    bufferIndex = 0
  return {
    [symbolIterator]() {
      return this
    },
    next() {
      if (bufferIndex < buffer.length) {
        const value = buffer[bufferIndex]
        bufferIndex += 1
        return { value, done: false }
      }

      const iteration = iterator.next()
      if (iteration.done) {
        return iteration
      }
      const monadAsArray = genericReduce(
        [flatMapper(iteration.value)],
        arrayPush,
        []) // this will always have at least one item
      if (monadAsArray.length > 1) {
        buffer = monadAsArray
        bufferIndex = 1
      }
      return {
        value: monadAsArray[0],
        done: false,
      }
    },
  }
}

module.exports = FlatMappingIterator
