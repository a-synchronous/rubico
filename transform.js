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
 * type Foldable = Iterable|AsyncIterable|Object<value any>
 *
 * type Reducer = (
 *   accumulator any,
 *   value any,
 *   indexOrKey? number|string,
 *   collection? Foldable,
 * )=>(nextAccumulator Promise|any)
 *
 * type Transducer = Reducer=>Reducer
 *
 * type Transformable =
 *   Array|String|Set|TypedArray|{ concat: function }|{ write: function }|Object
 *
 * type TransformableResolver = (collection Foldable)=>Promise|Transformable
 *
 * transform(
 *   collection Foldable,
 *   transducer Transducer,
 *   initialValue? Transformable|TransformableResolver,
 * ) -> result Promise|Transformable
 *
 * transform(
 *   transducer Transducer,
 *   initialValue? Transformable|TransformableResolver,
 * )(collection Foldable) -> result Promise|Transformable
 * ```
 *
 * @description
 * Transforms a transformable collection into any other transformable collection. The type of transformation depends on the collection provided by the initial value. If the initial is a function it is used as a resolver for the provided collection. `transform` accepts transformable collections, or collections that support a concatenation operation:
 *
 *  * `Array`; concatenation defined by `result.concat(values)`
 *  * `string`; concatenation defined by `result + values`
 *  * `Set`; concatenation defined by `result.add(...values)`
 *  * `TypedArray`; concatenation defined by `result.set(prevResult); result.set(values, offset)`
 *  * `{ concat: function }`; concatenation defined by `result.concat(values)`
 *  * `{ write: function }`; concatenation defined by `result.write(item)`
 *  * `Object`; concatenation defined by `({ ...result, ...values })`
 *
 * `transform` can transform any of the above collections into any of the other above collections.
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
 *   transform(squaredOdds, [])([1, 2, 3, 4, 5])
 * ) // [1, 9, 25]
 *
 * // transform arrays into strings
 * console.log(
 *   transform(squaredOdds, '')([1, 2, 3, 4, 5])
 * ) // '1925'
 *
 * // transform arrays into sets
 * console.log(
 *   transform(squaredOdds, new Set())([1, 2, 3, 4, 5])
 * ) // Set (3) { 1, 9, 25 }
 *
 * // transform arrays into typed arrays
 * console.log(
 *   transform(squaredOdds, new Uint8Array())([1, 2, 3, 4, 5]),
 * ) // Uint8Array(3) [ 1, 9, 25 ]
 * ```
 *
 * `transform` arrays into objects that implement `.concat`.
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
 * transform(Transducer.map(square), Stdout)([1, 2, 3, 4, 5])
 * // 1
 * // 4
 * // 9
 * // 16
 * // 25
 * ```
 *
 * `transform` an async generator into `process.stdout`, a Node.js writable stream that implements `.write`.
 *
 * ```javascript [playground]
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
 * const Stdout = {
 *   concat(...args) {
 *     console.log(...args)
 *     return this
 *   },
 * }
 *
 * transform(
 *   streamRandomInts(10),
 *   compose([
 *     Transducer.map(square),
 *     Transducer.map(toString),
 *   ]),
 *   Stdout,
 * )
 * // 8281
 * // 8836
 * // 1156
 * // 8649
 * // 5625
 * // 2500
 * // ...
 * ```
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
