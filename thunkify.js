/**
 * @name thunkify
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var func function,
 *   args ...any
 *
 * thunkify(func, ...args) -> thunk ()=>func(...args)
 * ```
 *
 * @description
 * Create a thunk from a function and any number of arguments. A thunk is a function that takes no arguments - the computation it represents has already been "thunk" with given function and arguments.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const thunkAdd12 = thunkify(add, 1, 2)
 *
 * console.log(thunkAdd12()) // 3
 * ```
 */
const thunkify = (func, ...args) => function thunk() {
  return func(...args)
}

module.exports = thunkify
