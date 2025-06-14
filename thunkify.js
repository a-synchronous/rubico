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
 * argsWithPromises Array<Promise|any>
 *
 * thunkify(func function, ...argsWithPromises) -> thunk function
 * ```
 *
 * @description
 * Create a thunk function from an original function and any number of arguments. A thunk function takes no arguments, and when called, executes the original function with the previously provided arguments. The original function is said to be "thunkified".
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const thunkAdd12 = thunkify(add, 1, 2)
 *
 * console.log(thunkAdd12()) // 3
 * ```
 *
 * If any promises are passed as arguments, they are resolved before being applied to the original function, and `thunkify` returns a promise of the thunk function.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const promise = thunkify(add, Promise.resolve(1), 2)
 * const thunkAdd12 = await promise
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
const thunkify = function (func, ...args) {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(resolvedArgs => function thunk() {
      return func(...resolvedArgs)
    })
  }
  return function thunk() {
    return func(...args)
  }
}

module.exports = thunkify
