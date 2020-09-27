/**
 * @name thunkifyArgs
 *
 * @synopsis
 * ```coffeescript [specscript]
 * thunkifyArgs(func function, args Array) -> ()=>func(...args)
 * ```
 *
 * @synopsis
 * Create a thunk from a function and an arguments array.
 */
const thunkifyArgs = (func, args) => function thunk() {
  return func(...args)
}

module.exports = thunkifyArgs
