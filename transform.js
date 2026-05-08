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
 * type Semigroup = Array|String|Set|TypedArray|{ concat: function }|{ write: function }|Object
 *
 * type UnarySyncOrAsyncSemigroupResolver = any=>Promise|Semigroup
 *
 * transform(foldable Promise|Foldable, transducer, initialValue Promise|any) -> result Promise|Semigroup
 * transform(foldable Promise|Foldable, transducer, initialResolver UnarySyncOrAsyncSemigroupResolver) -> result Promise|Semigroup
 *
 * transform(transducer, initialValue Promise|any)(foldable Foldable) -> result Promise|Semigroup
 * transform(transducer, initialResolver UnarySyncOrAsyncSemigroupResolver)(foldable Foldable) -> result Promise|Semigroup
 * ```
 *
 * @description
 * Transforms a foldable into a semigroup with a [transducer](https://rubico.land/blog/transducers-crash-course-rubico-v2).
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
 * The transducer defines the transformation done by `transform`. In a transformation, each item of the foldable is processed by the transducer.
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
 * const array = [1, 2, 3, 4, 5]
 *
 * // transform arrays into arrays
 * const squaredOddsArray = transform(array, squaredOdds, [])
 * console.log('array into array')
 * console.log(squaredOddsArray)
 *
 * // transform arrays into strings
 * const squaredOddsString = transform(array, squaredOdds, '')
 * console.log('array into string')
 * console.log(squaredOddsString)
 *
 * // transform arrays into sets
 * const squaredOddsSet = transform(array, squaredOdds, new Set())
 * console.log('array into set')
 * console.log(squaredOddsSet)
 *
 * // transform arrays into typed arrays
 * const squaredOddsUint8Array = transform(array, squaredOdds, new Uint8Array())
 * console.log('array into binary')
 * console.log(squaredOddsUint8Array)
 * ```
 *
 * Any object that implements concat may be used as the semigroup for `transform`.
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
 * ```
 *
 * Node.js `process.stdout`, a writable stream (implements the `write` method), may be used as the semigroup for `transform`
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
 * If the initial value is a function, it is treated as a resolver of the semigroup. The resolver may be asynchronous.
 *
 * ```javascript [playground]
 * const result = await transform(
 *   [1, 2, 3, 4, 5],
 *   Transducer.map(number => number ** 2),
 *   async () => []
 * )
 *
 * console.log(result)
 * ```
 *
 * If the foldable or initial value is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * const resultFromPromiseFoldable = await transform(
 *   Promise.resolve([1, 2, 3, 4, 5]),
 *   Transducer.map(n => n ** 2),
 *   []
 * )
 *
 * const resultFromPromiseSemigroup = await transform(
 *   [1, 2, 3, 4, 5],
 *   Transducer.map(n => n ** 2),
 *   Promise.resolve([])
 * )
  *
 * console.log(resultFromPromiseFoldable)
 * console.log(resultFromPromiseSemigroup)
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
