const isArray = require('../_internal/isArray')
const isPromise = require('../_internal/isPromise')
const thunkConditional = require('../_internal/thunkConditional')
const __ = require('../_internal/placeholder')
const always = require('../_internal/always')
const curry3 = require('../_internal/curry3')
const thunkify3 = require('../_internal/thunkify3')

/**
 * @name findIndexAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * findIndexAsync(
 *   predicate function,
 *   array Array,
 *   index number
 * ) -> index Promise<number>
 * ```
 */
const findIndexAsync = async function (predicate, array, index) {
  const length = array.length
  while (++index < length) {
    let predication = predicate(array[index])
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return index
    }
  }
  return -1
}

/**
 * @name findIndex
 *
 * @synopsis
 * ```coffeescript [specscript]
 * findIndex(predicate function)(array Array) -> index Promise|number
 * ```
 *
 * @description
 * Returns the index of the first element in an array that satisfies the predicate. Returns -1 if no element satisfies the predicate.
 *
 * ```javascript [playground]
 * import findIndex from 'https://unpkg.com/rubico/dist/x/findIndex.es.js'
 *
 * const oddNumberIndex = findIndex(function isOdd(number) {
 *   return number % 2 == 1
 * })([2, 3, 5])
 *
 * console.log(oddNumberIndex) // 1
 * ```
 *
 * @since 1.6.26
 */
const findIndex = predicate => function findingIndex(array) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        always(index),
        thunkify3(findIndexAsync, predicate, array, index),
      ))
    }
    if (predication) {
      return index
    }
  }
  return -1
}

module.exports = findIndex
