/**
 * @name thunkify
 *
 * @synopsis
 * ```coffeescript [specscript]
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
 */
const thunkify = (func, ...args) => function thunk() {
  return func(...args)
}

module.exports = thunkify
