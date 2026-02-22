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
 * args Array<any>
 *
 * thunkify(func function, ...args) -> thunk ()=>func(...args)
 * ```
 *
 * @description
 * Creates a thunk from a function and arguments. A thunk takes no arguments, and when called, executes the other function with the arguments. The other function is said to be "thunkified".
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const thunkAdd12 = thunkify(add, 1, 2)
 *
 * console.log(thunkAdd12()) // 3
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
 * args Array<any>
 *
 * thunkify.call(func function, context object, ...args) -> thunk ()=>func(...args)
 * ```
 *
 * Creates a thunk that calls a function with the specified context and arguments.
 *
 * ```javascript [playground]
 * class Point {
 *   constructor(x, y) {
 *     this.x = x
 *     this.y = y
 *   }
 *
 *   toString() {
 *     return `(${this.x}, ${this.y})`
 *   }
 * }
 *
 * const thunk = thunkify.call(toString, point)
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
