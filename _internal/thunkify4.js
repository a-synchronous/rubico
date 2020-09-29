/**
 * @name thunkify4
 *
 * @synopsis
 * ```coffeescript [specscript]
 * thunkify4<
 *   arg0 any,
 *   arg1 any,
 *   arg2 any,
 *   arg3 any,
 *   func (arg0, arg1, arg2, arg3)=>any,
 * >(func, arg0, arg1, arg2, arg3) -> thunk ()=>func(arg0, arg1, arg2, arg3)
 * ```
 *
 * @description
 * Create a thunk from a function and four arguments.
 */
const thunkify4 = (func, arg0, arg1, arg2, arg3) => function thunk() {
  return func(arg0, arg1, arg2, arg3)
}

module.exports = thunkify4
