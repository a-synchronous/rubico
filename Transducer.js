const funcConcat = require('./_internal/funcConcat')
const reducerMap = require('./_internal/reducerMap')
const reducerFilter = require('./_internal/reducerFilter')
const reducerFlatMap = require('./_internal/reducerFlatMap')
const reducerForEach = require('./_internal/reducerForEach')
const reducerTryCatch = require('./_internal/reducerTryCatch')
const curry2 = require('./_internal/curry2')
const curry3 = require('./_internal/curry3')
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
 * type Reducer = (
 *   accumulator any,
 *   value any,
 *   indexOrKey? number|string,
 *   collection? Foldable,
 * )=>(nextAccumulator Promise|any)
 *
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.map(mapperFunc function) -> mappingTransducer Transducer
 * ```
 *
 * @description
 * Creates a mapping transducer. Items in the final reducing operation are transformed by the mapper function. It is possible to use an asynchronous mapper, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
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
 *   reduce([1, 2, 3, 4, 5], squareConcatReducer, [])
 * ) // [1, 4, 9, 16, 25]
 *
 * // the same squareConcatReducer is consumable with vanilla JavaScript
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squareConcatReducer, [])
 * ) // [1, 4, 9, 16, 25]
 *
 * // concat is implicit when transforming into arrays
 * console.log(
 *   transform([1, 2, 3, 4, 5], Transducer.map(square), [])
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * Read more on transducers [here](/blog/transducers-crash-course-rubico-v2).
 */
Transducer.map = function transducerMap(mapper) {
  return curry2(reducerMap, __, mapper)
}

/**
 * @name Transducer.filter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (
 *   accumulator any,
 *   value any,
 *   indexOrKey? number|string,
 *   collection? Foldable,
 * )=>(nextAccumulator Promise|any)
 *
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.filter(predicate function) -> filteringTransducer Transducer
 * ```
 *
 * @description
 * Creates a filtering transducer. A filtering reducer skips items of reducing operation if they test falsy by the predicate. It is possible to use an asynchronous predicate, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
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
 * type Reducer = (
 *   accumulator any,
 *   value any,
 *   indexOrKey? number|string,
 *   collection? Foldable,
 * )=>(nextAccumulator Promise|any)
 *
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.flatMap(flatMapper) -> flatMappingTransducer Transducer
 * ```
 *
 * @description
 * Creates a flatMapping transducer. A flatMapping transducer applies the flatMapping function to each item of the reducing operation, concatenating the results of the flatMapper execution into the final result. It is possible to use an asynchronous flatMapper, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
 *
 * ```javascript [playground]
 * const powers = number => [number, number ** 2, number ** 3]
 *
 * const numbers = [1, 2, 3, 4, 5]
 *
 * console.log(
 *   transform(numbers, Transducer.flatMap(powers), [])
 * ) // [1, 1, 1, 2, 4, 8, 3, 9, 27, 4, 16, 64, 5, 25, 125]
 * ```
 *
 * Read more on transducers [here](/blog/transducers-crash-course-rubico-v2).
 */
Transducer.flatMap = function transducerFlatMap(flatMapper) {
  return curry2(reducerFlatMap, __, flatMapper)
}

/**
 * @name Transducer.forEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (
 *   accumulator any,
 *   value any,
 *   indexOrKey? number|string,
 *   collection? Foldable,
 * )=>(nextAccumulator Promise|any)
 *
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.forEach(func function) -> forEachTransducer Transducer
 * ```
 *
 * @description
 * Creates an effectful pasthrough transducer. The effectful passthrough transducer applies the effectful function to each item of the reducing operation, leaving the reducing operation unchanged. It is possible to use an asynchronous effectful function, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
 *
 * ```javascript [playground]
 * const numbers = [1, 2, 3, 4, 5]
 * transform(numbers, compose([
 *   Transducer.map(number => number ** 2),
 *   Transducer.forEach(console.log), // 1 4 9 16 25
 * ]), null)
 * ```
 */
Transducer.forEach = function transducerForEach(func) {
  return curry2(reducerForEach, __, func)
}

/**
 * @name Transducer.passthrough
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (
 *   accumulator any,
 *   value any,
 *   indexOrKey? number|string,
 *   collection? Foldable,
 * )=>(nextAccumulator Promise|any)
 *
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.passthrough(func function) -> passthroughTransducer Transducer
 * ```
 *
 * @description
 * Creates a pasthrough transducer. The passthrough transducer passes each item of the reducing operation through, leaving the reducing operation unchanged.
 *
 * ```javascript [playground]
 * const createAsyncNumbers = async function* () {
 *   let number = 0
 *   while (number < 10) {
 *     yield number
 *     number += 1
 *   }
 * }
 *
 * transform(createAsyncNumbers(), Transducer.passthrough, [])
 *   .then(console.log) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 * ```
 */
Transducer.passthrough = function transducerPassthrough(reducer) {
  return reducer
}

/**
 * @name Transducer.tryCatch
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (
 *   accumulator any,
 *   item any,
 *   indexOrKey? number|string,
 *   collection? Foldable,
 * )=>(nextAccumulator Promise|any)
 *
 * type Transducer = Reducer=>Reducer
 *
 * Transducer.tryCatch(
 *   transducerTryer Transducer,
 *   catcher (error Error, item any)=>Promise|any,
 * ) -> tryCatchTransducer Transducer
 * ```
 *
 * @description
 * Creates an error handling transducer. The error handling transducer wraps a transducer and catches any errors thrown by the transducer with the catcher function. The catcher function is provided the error as well as the original item (before any processing by the transducer) for which the error was thrown. It is possible for either the transducer or the catcher to be asynchronous, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
 *
 * ```javascript [playground]
 * const db = new Map()
 * db.set('a', { id: 'a', name: 'George' })
 * db.set('b', { id: 'b', name: 'Jane' })
 * db.set('c', { id: 'c', name: 'Jill' })
 * db.set('e', { id: 'e', name: 'Jim' })
 *
 * const userIds = ['a', 'b', 'c', 'd', 'e']
 *
 * transform(userIds, Transducer.tryCatch(compose([
 *   Transducer.map(async userId => {
 *     if (db.has(userId)) {
 *       return db.get(userId)
 *     }
 *     throw new Error(`user ${userId} not found`)
 *   }),
 *
 *   Transducer.forEach(user => {
 *     console.log('Found', user.name)
 *   })
 * ]), (error, userId) => {
 *   console.error(error)
 *   console.log('userId in catcher:', userId)
 *   // original userId for which the error was thrown is provided
 * }), null)
 * ```

 */
Transducer.tryCatch = function transducerTryCatch(transducerTryer, catcher) {
  return curry3(reducerTryCatch, __, transducerTryer, catcher)
}

module.exports = Transducer
