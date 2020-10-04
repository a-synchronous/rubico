const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const genericTransform = require('./_internal/genericTransform')

/**
 * @name transform
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 * Semigroup<T> = Array<T>|String<T>|Set<T>|TypedArray<T>
 *   |{ concat: Reducer<T> }|{ write: Reducer<T> }|Object<T>
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T>=>any }|Object<T>
 *
 * var T any,
 *   args ...any,
 *   transducer Reducer=>Reducer,
 *   init (...args=>Promise|Semigroup<T>)|Semigroup<T>,
 *   foldable Foldable<T>,
 *   generatorFunction ...args=>Generator<T>,
 *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
 *   reducers ...Reducer<T>
 *
 * transform(transducer, init?)(foldable) -> Promise|Semigroup
 *
 * transform(transducer, init?)(generatorFunction) -> ...args=>Promise|Semigroup
 *
 * transform(transducer, init?)(asyncGeneratorFunction) -> ...args=>Promise|Semigroup
 *
 * transform(transducer, init?)(...reducers) -> ...args=>Promise|Semigroup
 * ```
 *
 * @description
 * Reduce a value by transducer and concatenation, returning a semigroup of transduced items. The initial value may be a function, in which case it is treated as a resolver.
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
 * console.log(
 *   transform(squaredOdds, () => [])([1, 2, 3, 4, 5]),
 * ) // [1, 9, 25]
 *
 * console.log(
 *   transform(squaredOdds, '')([1, 2, 3, 4, 5]),
 * ) // '1925'
 *
 * console.log(
 *   transform(squaredOdds, () => new Uint8Array())([1, 2, 3, 4, 5]),
 * ) // Uint8Array(3) [ 1, 9, 25 ]
 * ```
 *
 * A `Semigroup` is any type with some notion of concatenation. This could possibly manifest in a `.concat` method.
 *  * `Array` - `result.concat(values)`
 *  * `string` - `result + values`
 *  * `Set` - `result.add(...values)`
 *  * `TypedArray` - `result.set(prevResult); result.set(values, offset)`
 *  * `{ concat: function }` - `result.concat(values)`
 *  * `{ write: function }` - essentially `item.pipe(result)` or `result.write(item)`
 *  * `Object` - `({ ...result, ...values })`
 *
 * Here is a simple `Semigroup` as an object that implements `.concat`.
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
 * Here is a transformation of an async generator to a Node.js writable stream, `process.stdout`.
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
 * `transform`, like `reduce`, supports reducer combination. This variant of state management automatically assigns (`Object.assign`) pipeline objects into the aggregate state object.
 *
 * ```javascript [playground]
 * const reducerA = async (state, action) => {
 *   if (action.type == 'A') return { ...state, A: true }
 *   return state
 * }
 *
 * const reducerB = async (state, action) => {
 *   if (action.type == 'B') return { ...state, B: true }
 *   return state
 * }
 *
 * const reducerC = async (state, action) => {
 *   if (action.type == 'C') return { ...state, C: true }
 *   return state
 * }
 *
 * const logAction = function (action) {
 *   console.log('action', action)
 *   return action
 * }
 *
 * const reducingABC = transform(
 *   map(logAction), // transducer logger middleware
 *   () => ({}), // initial state resolver
 * )(reducerA, reducerB, reducerC)
 *
 * const actions = [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
 *
 * reducingABC(actions).then(
 *   state => console.log('state', state))
 * // action { type: 'A' }
 * // action { type: 'B' }
 * // action { type: 'C' }
 * // state { A: true, B: true, C: true }
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
