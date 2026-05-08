const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const promiseAll = require('./_internal/promiseAll')
const curry3 = require('./_internal/curry3')
const __ = require('./_internal/placeholder')
const funcApply2 = require('./_internal/funcApply2')

/**
 * @name _thunkifyArgs
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _thunkifyArgs(func function, context object, args Array) -> thunk
 * ```
 */
function _thunkifyArgs(func, context, args) {
  return function thunk() {
    return func.apply(context, args)
  }
}

/**
 * @name thunkify
 *
 * @synopsis
 * ```coffeescript [specscript]
 * thunkify(func function, ...arguments) -> thunk function
 * ```
 *
 * @description
 * Creates a thunk function from a function and arguments. A thunk function takes no arguments, and when called, executes the function and arguments. The function is said to be "thunkified".
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const thunkAdd12 = thunkify(add, 1, 2)
 *
 * console.log(thunkAdd12())
 * ```
 *
 * Any promises in `arguments` are resolved for their values during thunk creation.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const thunkAdd12 = await thunkify(add, Promise.resolve(1), 2)
 *
 * console.log(thunkAdd12())
 * ```
 *
 * See also:
 *  * [eq](/docs/eq)
 *  * [thunkify.call](/docs/thunkify.call)
 *  * [always](/docs/always)
 *  * [curry](/docs/curry)
 *  * [__](/docs/__)
 *  * [Transducer.map](/docs/Transducer.map)
 *
 */
const thunkify = function thunkify(func, ...args) {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry3(_thunkifyArgs, func, this, __))
  }
  return _thunkifyArgs(func, this, args)
}

/**
 * @name thunkify.call
 *
 * @synopsis
 * ```coffeescript [specscript]
 * thunkify.call(func function, context object, ...arguments) -> thunk function
 * ```
 *
 * @description
 * Creates a thunk function that calls a function with the specified context and arguments.
 *
 * ```javascript [playground]
 * class Point {
 *   constructor(x, y) {
 *     this.x = x
 *     this.y = y
 *   }
 *
 *   distanceTo(point) {
 *     const x2 = (point.x - this.x) ** 2
 *     const y2 = (point.y - this.y) ** 2
 *     return (x2 + y2) ** 0.5
 *   }
 * }
 *
 * const point0 = new Point(0, 0)
 * const point1 = new Point(3, 4)
 *
 * const thunk = thunkify.call(point0.distanceTo, point0, point1)
 *
 * console.log(thunk())
 * ```
 *
 * Any promises in `arguments` are resolved for their values during thunk creation.
 *
 * ```javascript [playground]
 * class Point {
 *   constructor(x, y) {
 *     this.x = x
 *     this.y = y
 *   }
 *
 *   distanceTo(point) {
 *     const x2 = (point.x - this.x) ** 2
 *     const y2 = (point.y - this.y) ** 2
 *     return (x2 + y2) ** 0.5
 *   }
 * }
 *
 * const point0 = new Point(0, 0)
 * const point1 = new Point(3, 4)
 *
 * const thunk = await thunkify.call(point0.distanceTo, point0, Promise.resolve(point1))
 *
 * console.log(thunk())
 * ```
 *
 * See also:
 *  * [eq](/docs/eq)
 *  * [thunkify](/docs/thunkify)
 *  * [always](/docs/always)
 *  * [curry](/docs/curry)
 *  * [__](/docs/__)
 *  * [Transducer.map](/docs/Transducer.map)
 *
 */
thunkify.call = function thunkifyCall(func, context, ...args) {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry3(_thunkifyArgs, func, context, __))
  }
  return _thunkifyArgs(func, context, args)
}

module.exports = thunkify
