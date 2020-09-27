/**
 * @name thunkify2
 *
 * @synopsis
 * ```coffeescript [specscript]
 * thunkify2<
 *   arg0 any,
 *   arg1 any,
 *   func (arg0, arg1)=>any,
 * >(func, arg0, arg1) -> thunk ()=>func(arg0, arg1)
 * ```
 *
 * @description
 * Create a thunk from a function and two arguments.
 */
const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

module.exports = thunkify2
