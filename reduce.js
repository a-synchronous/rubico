const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const genericReduce = require('./_internal/genericReduce')

// _reduce(collection any, reducer function, initialValue function|any) -> Promise
const _reduce = function (collection, reducer, initialValue) {
  if (typeof initialValue == 'function') {
    const actualInitialValue = initialValue(collection)
    return isPromise(actualInitialValue)
      ? actualInitialValue.then(curry3(genericReduce, collection, reducer, __))
      : genericReduce(collection, reducer, actualInitialValue)
  }
  return isPromise(initialValue)
    ? initialValue.then(curry3(genericReduce, collection, reducer, __))
    : genericReduce(collection, reducer, initialValue)
}

/**
 * @name reduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (
 *   accumulator any,
 *   value any,
 *   indexOrKey? number|string,
 *   collection? Array
 * )=>(nextAccumulator Promise|any)
 *
 * reduce(
 *   collection Array|Object|Map|Iterator|AsyncIterator,
 *   reducer Reducer,
 *   initialValue? function|any,
 * ) -> result Promise|any
 *
 * reduce(
 *   reducer Reducer,
 *   initialValue? function|any,
 * )(collection Array|Object|Map|Iterator|AsyncIterator) -> result Promise|any
 * ```
 *
 * @description
 * Transforms a collection based on a reducer function and optional initial value. In a reducing operation, the result is defined in the beginning as either the initial value if supplied or the first item of the collection. The reducing operation then iterates through the remaining items in the collection, executing the reducer at each iteration to return the result to be used in the next iteration. The final result is the result of the execution of the reducer at the last item of the iteration. `reduce` accepts the following collections:
 *
 *  * `Array`
 *  * `Object`
 *  * `Set`
 *  * `Map`
 *  * `Iterator`/`Generator`
 *  * `AsyncIterator`/`AsyncGenerator`
 *
 * For arrays (type `Array`), `reduce` executes the reducer function for each item of the array in order, returning a new result at each execution to be used in the next execution. On each iteration, the reducer is passed the accumulator, the item of the iteration, the index of the item in the array, and a reference to the original array.
 *
 * ```javascript [playground]
 * const max = (a, b) => a > b ? a : b
 *
 * console.log(
 *   reduce([1, 3, 5, 4, 2], max)
 * ) // 5
 *
 * console.log(
 *   reduce(max)([1, 3, 5, 4, 2])
 * ) // 5
 * ```
 *
 * If an optional initial value is provided, the result starts as the provided initial value rather than the first item of the collection.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * console.log(reduce([1, 2, 3, 4, 5], add, 0)) // 15
 * console.log(reduce(add, 0)([1, 2, 3, 4, 5])) // 15
 * ```
 *
 * If the initialization parameter is a function, it is treated as a resolver and called with the arguments to resolve the initial value.
 *
 * ```javascript [playground]
 * const concatSquares = (array, value) => array.concat(value ** 2)
 *
 * const contrivedInitializer = array => [`initial length ${array.length}`]
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * console.log(reduce(concatSquares, contrivedInitializer)(array))
 * // ['initial length 5', 1, 4, 9, 16, 25]
 * console.log(reduce(array, concatSquares, contrivedInitializer))
 * // ['initial length 5', 1, 4, 9, 16, 25]
 * ```
 *
 * For objects (type `Object`), `reduce` executes the reducer function for each value of the object. On each iteration, the reducer is passed the accumulator, the object value, the key of the object value, and a reference to the original object.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 *
 * console.log(
 *   reduce(obj, add)
 * ) // 15
 *
 * console.log(
 *   reduce(add)(obj)
 * ) // 15
 * ```
 *
 * For sets (type `Set`), `reduce` executes the reducer function for each item of the set. On each iteration, the reducer is passed the accumulator and item of the set.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const set = new Set([1, 2, 3, 4, 5])
 *
 * console.log(
 *   reduce(set, add)
 * ) // 15
 *
 * console.log(
 *   reduce(add)(set)
 * ) // 15
 * ```
 *
 * For maps (type `Map`), `reduce` executes the reducer function for each value of each entry of the map. On each iteration, the reducer is passed the accumulator, the map item, the key of the map item, and a reference to the original map.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * console.log(
 *   reduce(m, add)
 * ) // 15
 *
 * console.log(
 *   reduce(add)(m)
 * ) // 15
 * ```
 *
 * For iterators (type `Iterator`) and generators (type `Generator`), `reduce` executes the reducer function for each value of the iterator/generator. On each iteration, the reducer is passed the accumulator and the item of the iteration. The iterator/generator is consumed in the process.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const generate12345 = function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * console.log(
 *   reduce(generate12345(), add)
 * ) // 15
 *
 * console.log(
 *   reduce(add)(generate12345())
 * ) // 15
 * ```
 *
 * For asyncIterators (type `AsyncIterator`) and asyncGenerators (type `AsyncGenerator`), `reduce` executes the reducer function for each value of the asyncIterator/asyncGenerator. On each iteration, the reducer is passed the accumulator and the item of the async iteration. The asyncIterator/asyncGenerator is consumed in the process.
 *
 * ```javascript [playground]
 * const asyncAdd = async (a, b) => a + b
 *
 * const asyncGenerate12345 = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * reduce(asyncGenerate12345(), asyncAdd).then(console.log) // 15
 *
 * reduce(asyncAdd)(asyncGenerate12345()).then(console.log) // 15
 * ```
 *
 * @execution series
 *
 * @transducing
 *
 * @TODO readerReduce
 *
 * @TODO reduce.concurrent
 */

const reduce = function (...args) {
  if (typeof args[0] == 'function') {
    return curry3(_reduce, __, args[0], args[1])
  }
  if (isPromise(args[0])) {
    return args[0].then(curry3(_reduce, __, args[1], args[2]))
  }
  return _reduce(args[0], args[1], args[2])
}

module.exports = reduce
