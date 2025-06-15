const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const promiseAll = require('./_internal/promiseAll')
const curry2 = require('./_internal/curry2')
const __ = require('./_internal/placeholder')
const funcApply = require('./_internal/funcApply')

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
 * Create a thunk function from another function and any number of arguments. The thunk function takes no arguments, and when called, executes the other function with the provided arguments. The other function is said to be "thunkified".
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
 *  * [always](/docs/always)
 *  * [curry](/docs/curry)
 *  * [__](/docs/__)
 *  * [Transducer.map](/docs/Transducer.map)
 *
 */
const thunkify = (func, ...args) => function thunk() {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(funcApply, func, __))
  }
  return func(...args)
}

module.exports = thunkify
