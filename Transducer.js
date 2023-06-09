const funcConcat = require('./_internal/funcConcat')
const reducerMap = require('./_internal/reducerMap')
const reducerFilter = require('./_internal/reducerFilter')
const reducerFlatMap = require('./_internal/reducerFlatMap')
const reducerForEach = require('./_internal/reducerForEach')
const curry2 = require('./_internal/curry2')
const __ = require('./_internal/placeholder')

/**
 * @name Transducer
 *
 * @description
 * Temporary repository of transducer functionality throughout rubico v1
 */
const Transducer = {}

/**
 * @name Transducer.map
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (accumulator any, item any)=>(nextAccumulator Promise|any)
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.map(mapperFunc function) -> mappingTransducer Transducer
 * ```
 *
 * @description
 * Creates a mapping transducer with a provided reducer. A reducer is a variadic function that depicts a relationship between an accumulator and any number of arguments. A transducer is a function that accepts a reducer as an argument and returns another reducer.
 *
 * ```coffeescript [specscript]
 * type Reducer = (accumulator any, item any)=>(nextAccumulator Promise|any)
 *
 * type Transducer = Reducer=>Reducer
 * ```
 *
 * The transducer signature enables chaining functionality for reducers. `map` is core to this mechanism, and provides a way via transducers to transform the items of reducers.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const concat = (array, item) => array.concat(item)
 *
 * const mapSquare = Transducer.map(square)
 * // mapSquare is a transducer
 *
 * const squareConcatReducer = mapSquare(concat)
 * // now mapSquare is passed the reducer function concat; squareConcatReducer
 * // is a reducer with chained functionality square and concat
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squareConcatReducer, []),
 * ) // [1, 4, 9, 16, 25]
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squareConcatReducer, ''),
 * ) // '1491625'
 * ```
 *
 * Create reducers with chained functionality by using the `Transducer.map` eager API.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const concat = (array, item) => array.concat(item)
 *
 * const squareConcatReducer = Transducer.map(concat, square)
 * // now mapSquare is passed the reducer function concat; squareConcatReducer
 * // is a reducer with chained functionality square and concat
 * ```
 */
Transducer.map = function transducerMap(mapper) {
  return curry2(reducerMap, __, mapper)
}

/**
 * @name Transducer.filter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (accumulator any, item any)=>(nextAccumulator Promise|any)
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.filter(predicate function) -> filteringTransducer Transducer
 * ```
 *
 * @description
 * A reducer in filterable position creates a filtering reducer - one that skips items of the reducer's reducing operation if they test falsy by the predicate. It is possible to use an asynchronous predicate when filtering a reducer, however the implementation of `reduce` must support asynchronous operations. This library provides such an implementation as `reduce`.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const concat = (array, item) => array.concat(item)
 *
 * const concatOddNumbers = filter(isOdd)(concat)
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(concatOddNumbers, []),
 * ) // [1, 3, 5]
 * ```
 */
Transducer.filter = function transducerFilter(predicate) {
  return curry2(reducerFilter, __, predicate)
}

/**
 * @name Transducer.flatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (accumulator any, item any)=>(nextAccumulator Promise|any)
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.flatMap(flatMapper) -> flatMappingTransducer Transducer
 * ```
 *
 * @description
 * Additionally, `flatMap` is a powerful option when working with transducers. A flatMapping transducer applies a flatMapper to each item of a reducer's reducing operation, calling each item of each execution with the reducer.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const powers = number => [number, number ** 2, number ** 3]
 *
 * const oddPowers = pipe([
 *   filter(isOdd),
 *   flatMap(powers),
 * ])
 *
 * const arrayConcat = (array, value) => array.concat(value)
 *
 * console.log(
 *   reduce(oddPowers(arrayConcat), [])([1, 2, 3, 4, 5]),
 * ) // [1, 1, 1, 3, 9, 27, 5, 25, 125]
 * ```
 *
 * In the case above, each item of the array of numbers returned by `powers` is called with the reducer `arrayConcat` for flattening into the final result.
 */
Transducer.flatMap = function transducerFlatMap(flatMapper) {
  return curry2(reducerFlatMap, __, flatMapper)
}

/**
 * @name Transducer.forEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (accumulator any, item any)=>(nextAccumulator Promise|any)
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.forEach(func function) -> forEachTransducer Transducer
 * ```
 */
Transducer.forEach = function transducerForEach(func) {
  return curry2(reducerForEach, __, func)
}

Transducer.passthrough = function transducerPassthrough(reducer) {
  return reducer
}

module.exports = Transducer
