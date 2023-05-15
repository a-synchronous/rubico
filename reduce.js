const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const genericReduce = require('./_internal/genericReduce')

/**
 * @name reduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayReducer (result any, value any, index number, array Array)=>(result Promise|any)
 * initialValue function|any
 *
 * reduce(arrayReducer, initialValue?)(array Array) -> result Promise|any
 * reduce(array Array, arrayReducer, initialValue?) -> result Promise|any
 *
 * objectReducer (result any, value any, key string, object Object)=>(result Promise|any)
 *
 * reduce(objectReducer, initialValue?)(object Object) -> result Promise|any
 * reduce(object Object, objectReducer, initialValue?) -> result Promise|any
 *
 * mapReducer (result any, value any, key any, map Map)=>(result Promise|any)
 *
 * reduce(mapReducer, initialValue?)(m Map) -> result Promise|any
 * reduce(m Map, mapReducer, initialValue?) -> result Promise|any
 *
 * reducer (result any, value any)=>(result Promise|any)
 *
 * reduce(reducer, initialValue?)(iterator Iterator) -> result Promise|any
 * reduce(iterator Iterator, reducer, initialValue?) -> result Promise|any
 *
 * reduce(reducer, initialValue?)(asyncIterator AsyncIterator)
 *   -> result Promise|any
 * reduce(asyncIterator AsyncIterator, reducer, initialValue?)
 *   -> result Promise|any
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
 * For arrays (type `Array`), `reduce` executes the reducer function for each item of the array in order, returning a new result at each execution to be used in the next execution.
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
 * For objects (type `Object`), `reduce` executes the reducer function for each value of the object.
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
 * For sets (type `Set`), `reduce` executes the reducer function for each item of the set.
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
 * For maps (type `Map`), `reduce` executes the reducer function for each value of each entry of the map.
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
 * For iterators (type `Iterator`) and generators (type `Generator`), `reduce` executes the reducer function for each value of the iterator/generator. The iterator/generator is consumed in the process.
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
 * For asyncIterators (type `AsyncIterator`) and asyncGenerators (type `AsyncGenerator`), `reduce` executes the reducer function for each value of the asyncIterator/asyncGenerator. The asyncIterator/asyncGenerator is consumed in the process.
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
  if (typeof args[0] != 'function') {
    const reducer = args[1]
    const initialValue = args[2]
    if (typeof initialValue == 'function') {
      return genericReduce(args[0], reducer, initialValue(args[0]))
    }
    if (isPromise(initialValue)) {
      return initialValue.then(curry3(genericReduce, args[0], reducer, __))
    }
    return genericReduce(args[0], reducer, initialValue)
  }

  const reducer = args[0]
  const initialValue = args[1]

  if (typeof initialValue == 'function') {
    return function reducing(collection) {
      const result = initialValue(collection)
      return isPromise(result)
        ? result.then(curry3(genericReduce, collection, reducer, __))
        : genericReduce(collection, reducer, result)
    }
  }
  return curry3(genericReduce, __, reducer, initialValue)
}

module.exports = reduce
