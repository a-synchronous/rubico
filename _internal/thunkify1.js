/**
 * @name thunkify1
 *
 * @synopsis
 * ```coffeescript [specscript]
 * thunkify1<
 *   arg0 any,
 *   func arg0=>any,
 * >(func, arg0) -> thunk ()=>func(arg0)
 * ```
 *
 * @description
 * Create a thunk from a function and one argument.
 */
const thunkify1 = (func, arg0) => function thunk() {
  return func(arg0)
}

module.exports = thunkify1
