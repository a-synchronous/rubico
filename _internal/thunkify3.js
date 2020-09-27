/**
 * @name thunkify3
 *
 * @synopsis
 * ```coffeescript [specscript]
 * thunkify3<
 *   arg0 any,
 *   arg1 any,
 *   arg2 any,
 *   func (arg0, arg1, arg2)=>any,
 * >(func, arg0, arg1, arg2) -> thunk ()=>func(arg0, arg1, arg2)
 * ```
 *
 * @description
 * Create a thunk from a function and three arguments.
 */
const thunkify3 = (func, arg0, arg1, arg2) => function thunk() {
  return func(arg0, arg1, arg2)
}

module.exports = thunkify3
