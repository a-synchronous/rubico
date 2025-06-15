const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const genericTransform = require('./_internal/genericTransform')

// _transform(collection any, transducer function, initialValue function|any) -> Promise
const _transform = function (collection, transducer, initialValue) {
  if (typeof initialValue == 'function') {
    const actualInitialValue = initialValue(collection)
    return isPromise(actualInitialValue)
      ? actualInitialValue.then(curry3(genericTransform, collection, transducer, __))
      : genericTransform(collection, transducer, actualInitialValue)
  }
  return isPromise(initialValue)
    ? initialValue.then(curry3(genericTransform, collection, transducer, __))
    : genericTransform(collection, transducer, initialValue)
}

/**
 * @name transform
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Foldable = Array|Set|Map|Generator|AsyncGenerator|{ reduce: function }|Object
 * type SyncOrAsyncReducer = (accumulator any, value any)=>(nextAccumulator Promise|any)
 * type Transducer = SyncOrAsyncReducer=>SyncOrAsyncReducer
 *
 * type Semigroup =
 *   Array|String|Set|TypedArray|{ concat: function }|{ write: function }|Object
 *
 * type UnarySyncOrAsyncSemigroupResolver = any=>Promise|Semigroup
 *
 * transducer Transducer
 * initial UnarySyncOrAsyncSemigroupResolver|Semigroup
 *
 * transform(foldable Promise|Foldable, transducer, initial?) -> result Promise|Semigroup
 * transform(transducer, initial?)(foldable Foldable) -> result Promise|Semigroup
 * ```
 *
 * @description
 * Transforms a foldable with [transducers](https://rubico.land/blog/transducers-crash-course-rubico-v2) into a semigroup.
 *
 * The following data types are considered to be foldables:
 *  * `array`
 *  * `set`
 *  * `map`
 *  * `generator`
 *  * `async generator`
 *  * `object with .reduce method`
 *  * `object`
 *
 * Transducers, due to their lazy nature, don't have knowledge of the foldable they are transforming. As such, the transducer signature for all foldables is the same:
 *
 * ```coffeescript [specscript]
 * type SyncOrAsyncReducer = (accumulator any, value any)=>(nextAccumulator Promise|any)
 * type Transducer = SyncOrAsyncReducer=>SyncOrAsyncReducer
 * ```
 *
 * The following data types are considered to be semigroups:
 *  * `array`
 *  * `string`
 *  * `set`
 *  * `binary`
 *  * `{ concat: function }`
 *  * `{ write: function }`
 *  * `object`
 *
 * The concatenation operation changes depending on the provided semigroup:
 *
 * If the semigroup is an array, concatenation is defined as:
 * ```javascript
 * nextAccumulator = accumulator.concat(values)
 * ```
 *
 * If the semigroup is a string, concatenation is defined as:
 * ```javascript
 * nextAccumulator = accumulator + values
 * ```
 *
 * If the semigroup is a set, concatenation is defined as:
 * ```javascript
 * nextAccumulator = accumulator.add(...values)
 * ```
 *
 * If the semigroup is binary, concatenation is defined as:
 * ```javascript
 * nextAccumulator = new accumulator.constructor(accumulator.length + values.length)
 * nextAccumulator.set(accumulator)
 * nextAccumulator.set(values, accumulator.length)
 * ```
 *
 * If the semigroup is an object with a `.concat` method, concatenation is defined as:
 * ```javascript
 * nextAccumulator = accumulator
 * accumulator.concat(values)
 * ```
 *
 * If the semigroup is an object with a `.write` method, concatenation is defined as:
 * ```javascript
 * nextAccumulator = accumulator
 * accumulator.write(values)
 * ```
 *
 * If the semigroup is a plain object, concatenation is defined as:
 * ```javascript
 * nextAccumulator = ({ ...accumulator, ...values })
 * ```
 *
 * `transform` transforms numbers from an array into another array.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const isOdd = number => number % 2 == 1
 *
 * const squaredOdds = compose([
 *   Transducer.filter(isOdd),
 *   Transducer.map(square),
 * ])
 *
 * // transform arrays into arrays
 * console.log(
 *   transform([1, 2, 3, 4, 5], squaredOdds, [])
 * ) // [1, 9, 25]
 *
 * // transform arrays into strings
 * console.log(
 *   transform([1, 2, 3, 4, 5], squaredOdds, '')
 * ) // '1925'
 *
 * // transform arrays into sets
 * console.log(
 *   transform([1, 2, 3, 4, 5], squaredOdds, new Set())
 * ) // Set (3) { 1, 9, 25 }
 *
 * // transform arrays into typed arrays
 * console.log(
 *   transform([1, 2, 3, 4, 5], squaredOdds, new Uint8Array()),
 * ) // Uint8Array(3) [ 1, 9, 25 ]
 * ```
 *
 * `transform` transforms arrays into objects that implement `.concat`.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const Stdout = {
 *   concat(...args) {
 *     console.log(...args)
 *     return this
 *   },
 * }
 *
 * transform([1, 2, 3, 4, 5], Transducer.map(square), Stdout)
 * // 1
 * // 4
 * // 9
 * // 16
 * // 25
 * ```
 *
 * `transform` transforms an async generator into `process.stdout`, a Node.js writable stream that implements `.write`.
 *
 * ```javascript
 * const { pipe, compose, transform } = rubico
 * // global Transducer
 *
 * const square = number => number ** 2
 *
 * const toString = value => value.toString()
 *
 * const randomInt = () => Math.ceil(Math.random() * 100)
 *
 * const streamRandomInts = async function* (n) {
 *   let ct = 0
 *   while (ct < n) {
 *     ct += 1
 *     yield randomInt()
 *   }
 * }
 *
 * transform(
 *   streamRandomInts(10),
 *   compose([
 *     Transducer.map(square),
 *     Transducer.map(toString),
 *   ]),
 *   process.stdout // 2893600784289441449001600409684644624324923044411225
 * )
 * ```
 *
 * If the initial value is a function it is treated as a resolver of the semigroup. The resolver may be asynchronous.
 *
 * ```javascript [playground]
 * const promise = transform(
 *   [1, 2, 3, 4, 5],
 *   Transducer.map(number => number ** 2),
 *   async () => ['a'],
 * )
 *
 * promise.then(console.log)
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * const promise = transform(
 *   Promise.resolve([1, 2, 3, 4, 5]),
 *   Transducer.map(n => n ** 2),
 *   [],
 * )
 *
 * promise.then(console.log) // [1, 4, 9, 16, 25]
 * ```
 *
 * See also:
 *  * [forEach](/docs/forEach)
 *  * [map](/docs/map)
 *  * [filter](/docs/filter)
 *  * [reduce](/docs/reduce)
 *  * [flatMap](/docs/flatMap)
 *  * [some](/docs/some)
 *
 * @execution series
 *
 * @transducing
 *
 * TODO explore Semigroup = Iterator|AsyncIterator
 */
const transform = function (...args) {
  if (typeof args[0] == 'function') {
    return curry3(_transform, __, args[0], args[1])
  }
  if (isPromise(args[0])) {
    return args[0].then(curry3(_transform, __, args[1], args[2]))
  }
  return _transform(args[0], args[1], args[2])
}

module.exports = transform
