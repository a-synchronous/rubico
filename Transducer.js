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
 * type SyncOrAsyncReducer = (accumulator any, value any)=>(nextAccumulator Promise|any)
 * type Transducer = SyncOrAsyncReducer=>SyncOrAsyncReducer
 * type UnarySyncOrAsyncMapper = (element any)=>(resultElement Promise|any)
 *
 * mapper UnarySyncOrAsyncMapper
 *
 * Transducer.map(mapper) -> mappingTransducer Transducer
 * ```
 *
 * @description
 * Creates a mapping transducer. Elements of the transducer's reducing operation are transformed by the mapper function. It is possible to use an asynchronous mapper, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const concat = (array, element) => array.concat(element)
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
 * Read more on [transducers](/blog/transducers-crash-course-rubico-v2).
 *
 * See also:
 *  * [thunkify](/docs/thunkify)
 *  * [Transducer.filter](/docs/Transducer.filter)
 *  * [Transducer.flatMap](/docs/Transducer.flatMap)
 *  * [Transducer.forEach](/docs/Transducer.forEach)
 *  * [Transducer.passthrough](/docs/Transducer.passthrough)
 *  * [Transducer.tryCatch](/docs/Transducer.tryCatch)
 *
 */
Transducer.map = function transducerMap(mapper) {
  return curry2(reducerMap, __, mapper)
}

/**
 * @name Transducer.filter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type SyncOrAsyncReducer = (accumulator any, value any)=>(nextAccumulator Promise|any)
 * type Transducer = SyncOrAsyncReducer=>SyncOrAsyncReducer
 * type UnarySyncOrAsyncPredicate = any=>Promise|boolean|any
 *
 * predicate UnarySyncOrAsyncPredicate
 *
 * Transducer.filter(predicate) -> filteringTransducer Transducer
 * ```
 *
 * @description
 * Creates a filtering transducer. A filtering transducer filters out elements of its reducing operation if they test false by the predicate. It is possible to use an asynchronous predicate, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const concat = (array, element) => array.concat(element)
 *
 * const concatOddNumbers = Transducer.filter(isOdd)(concat)
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const oddNumbers1 = array.reduce(concatOddNumbers, [])
 * console.log(oddNumbers1) // [1, 3, 5]
 *
 * const oddNumbers2 = transform(array, Transducer.filter(isOdd), [])
 * console.log(oddNumbers2) // [1, 3, 5]
 * ```
 *
 * Read more on [transducers](/blog/transducers-crash-course-rubico-v2).
 *
 * See also:
 *  * [thunkify](/docs/thunkify)
 *  * [Transducer.map](/docs/Transducer.map)
 *  * [Transducer.flatMap](/docs/Transducer.flatMap)
 *  * [Transducer.forEach](/docs/Transducer.forEach)
 *  * [Transducer.passthrough](/docs/Transducer.passthrough)
 *  * [Transducer.tryCatch](/docs/Transducer.tryCatch)
 *
 */
Transducer.filter = function transducerFilter(predicate) {
  return curry2(reducerFilter, __, predicate)
}

/**
 * @name Transducer.flatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type SyncOrAsyncReducer = (accumulator any, value any)=>(nextAccumulator Promise|any)
 * type Transducer = SyncOrAsyncReducer=>SyncOrAsyncReducer
 * type Monad = Array|String|Set|Generator|AsyncGenerator|{ flatMap: string }|{ chain: string }|Object
 * type UnarySyncOrAsyncFlatMapper = (element any)=>(monad Promise|Monad|any)
 *
 * flatMapper UnarySyncOrAsyncFlatMapper
 *
 * Transducer.flatMap(flatMapper) -> flatMappingTransducer Transducer
 * ```
 *
 * @description
 * Creates a flatMapping transducer. A flatMapping transducer applies the flatMapper function to each element of its reducing operation, concatenating the results of the flatMapper execution onto the accumulator. It is possible to use an asynchronous flatMapper, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
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
 * Read more on [transducers](/blog/transducers-crash-course-rubico-v2).
 *
 * See also:
 *  * [thunkify](/docs/thunkify)
 *  * [Transducer.map](/docs/Transducer.map)
 *  * [Transducer.filter](/docs/Transducer.filter)
 *  * [Transducer.forEach](/docs/Transducer.forEach)
 *  * [Transducer.passthrough](/docs/Transducer.passthrough)
 *  * [Transducer.tryCatch](/docs/Transducer.tryCatch)
 *
 */
Transducer.flatMap = function transducerFlatMap(flatMapper) {
  return curry2(reducerFlatMap, __, flatMapper)
}

/**
 * @name Transducer.forEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type SyncOrAsyncReducer = (accumulator any, value any)=>(nextAccumulator Promise|any)
 * type Transducer = SyncOrAsyncReducer=>SyncOrAsyncReducer
 * type UnarySyncOrAsyncCallback = (element any)=>Promise|undefined
 *
 * callback UnarySyncOrAsyncCallback
 *
 * Transducer.forEach(callback) -> forEachTransducer Transducer
 * ```
 *
 * @description
 * Executes a callback function for each element of a reducing operation, leaving the reducing operation unmodified. It is possible to use an asynchronous callback function, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
 *
 * ```javascript [playground]
 * const numbers = [1, 2, 3, 4, 5]
 * transform(numbers, compose(
 *   Transducer.map(number => number ** 2),
 *   Transducer.forEach(console.log), // 1 4 9 16 25
 * ), null)
 * ```
 *
 * Read more on [transducers](/blog/transducers-crash-course-rubico-v2).
 *
 * See also:
 *  * [thunkify](/docs/thunkify)
 *  * [Transducer.map](/docs/Transducer.map)
 *  * [Transducer.filter](/docs/Transducer.filter)
 *  * [Transducer.flatMap](/docs/Transducer.flatMap)
 *  * [Transducer.passthrough](/docs/Transducer.passthrough)
 *  * [Transducer.tryCatch](/docs/Transducer.tryCatch)
 *
 */
Transducer.forEach = function transducerForEach(func) {
  return curry2(reducerForEach, __, func)
}

/**
 * @name Transducer.passthrough
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type SyncOrAsyncReducer = (accumulator any, value any)=>(nextAccumulator Promise|any)
 * type Transducer = SyncOrAsyncReducer=>SyncOrAsyncReducer
 *
 * Transducer.passthrough Transducer
 * ```
 *
 * @description
 * Creates a pasthrough transducer. The passthrough transducer simply passes each element of the reducing operation through to the next downstream operation, leaving the reducing operation unmodified.
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
 *
 * Read more on [transducers](/blog/transducers-crash-course-rubico-v2).
 *
 * See also:
 *  * [thunkify](/docs/thunkify)
 *  * [Transducer.map](/docs/Transducer.map)
 *  * [Transducer.filter](/docs/Transducer.filter)
 *  * [Transducer.flatMap](/docs/Transducer.flatMap)
 *  * [Transducer.forEach](/docs/Transducer.forEach)
 *  * [Transducer.tryCatch](/docs/Transducer.tryCatch)
 *
 */
Transducer.passthrough = function transducerPassthrough(reducer) {
  return reducer
}

/**
 * @name Transducer.tryCatch
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type SyncOrAsyncReducer = (accumulator any, value any)=>(nextAccumulator Promise|any)
 * type Transducer = SyncOrAsyncReducer=>SyncOrAsyncReducer
 *
 * transducerTryer Transducer
 * catcher (error Error, element any)=>Promise|any
 *
 * Transducer.tryCatch(transducerTryer, catcher) -> tryCatchTransducer Transducer
 * ```
 *
 * @description
 * Creates an error handling transducer. The error handling transducer wraps a transducer and catches any errors thrown by the transducer with the catcher function. The catcher function is provided the error as well as the element for which the error was thrown. It is possible for either the transducer or the catcher to be asynchronous, however the reducing operation must support asynchronous execution. This library provides such implementations as [reduce](/docs/reduce) and [transform](/docs/transform).
 *
 * ```javascript [playground]
 * const db = new Map()
 * db.set('a', { id: 'a', name: 'John' })
 * db.set('b', { id: 'b', name: 'Jane' })
 * db.set('c', { id: 'c', name: 'Jill' })
 * db.set('e', { id: 'e', name: 'Jim' })
 *
 * const userIds = ['a', 'b', 'c', 'd', 'e']
 *
 * transform(userIds, Transducer.tryCatch(
 *   compose(
 *     Transducer.map(async userId => {
 *       if (db.has(userId)) {
 *         return db.get(userId)
 *       }
 *       throw new Error(`user ${userId} not found`)
 *     }),
 *
 *     Transducer.forEach(user => {
 *       console.log('Found', user.name)
 *     })
 *   ),
 *   (error, userId) => {
 *     console.error(error)
 *     console.log('userId in catcher:', userId)
 *     // original userId for which the error was thrown is provided
 *   }
 * ), null)
 * ```
 *
 * Read more on [transducers](/blog/transducers-crash-course-rubico-v2).
 *
 * See also:
 *  * [thunkify](/docs/thunkify)
 *  * [Transducer.map](/docs/Transducer.map)
 *  * [Transducer.filter](/docs/Transducer.filter)
 *  * [Transducer.flatMap](/docs/Transducer.flatMap)
 *  * [Transducer.forEach](/docs/Transducer.forEach)
 *  * [Transducer.passthrough](/docs/Transducer.passthrough)
 *
 */
Transducer.tryCatch = function transducerTryCatch(transducerTryer, catcher) {
  return curry3(reducerTryCatch, __, transducerTryer, catcher)
}

module.exports = Transducer
