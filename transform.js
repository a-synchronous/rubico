const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const genericTransform = require('./_internal/genericTransform')

/**
 * @name transform
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (result any, item any)=>(result any)
 * type Transducer = Reducer=>Reducer
 * type Semigroup = Array|String|Set|TypedArray|{ concat: function }|{ write: function }|Object
 * type Foldable = Iterable|AsyncIterable|Object
 *
 * initialValue Semigroup|((foldable Foldable)=>Promise|Semigroup)
 *
 * transform(
 *   transducer Transducer,
 *   initialValue?,
 * )(foldable Foldable) -> result Promise|Semigroup
 * ```
 *
 * @description
 * Transforms a semigroup collection into any other semigroup collection. The type of transformation depends on the collection provided by the initial value. If the initial is a function it is used as a resolver for the provided collection. `transform` accepts semigroup collections, or collections that support a concatenation operation:
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
 * const squaredOdds = pipe([
 *   filter(isOdd),
 *   map(square),
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
 * transform(map(square), Stdout)([1, 2, 3, 4, 5])
 * // 1
 * // 4
 * // 9
 * // 16
 * // 25
 * ```
 *
 * `transform` an async generator into `process.stdout`, a Node.js writable stream that implements `.write`.
 *
 * ```javascript [node]
 * // this example is duplicated in rubico/examples/transformStreamRandomInts.js
 *
 * const { pipe, map, transform } = require('rubico')
 *
 * const square = number => number ** 2
 *
 * const toString = value => value.toString()
 *
 * const randomInt = () => Math.ceil(Math.random() * 100)
 *
 * const streamRandomInts = async function* () {
 *   while (true) {
 *     yield randomInt()
 *   }
 * }
 *
 * transform(
 *   map(pipe([square, toString])), process.stdout,
 * )(streamRandomInts()) // 9216576529289484980147613249169774446246768649...
 * ```
 *
 * @execution series
 *
 * @transducing
 *
 * TODO explore Semigroup = Iterator|AsyncIterator
 */
const transform = function (transducer, init) {
  if (typeof init == 'function') {
    return function transforming(...args) {
      const result = init(...args)
      return isPromise(result)
        ? result.then(curry3(genericTransform, args, transducer, __))
        : genericTransform(args, transducer, result)
    }
  }
  return function transforming(...args) {
    return genericTransform(args, transducer, init)
  }
}

module.exports = transform
