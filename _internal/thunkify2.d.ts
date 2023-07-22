export = thunkify2;
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
declare function thunkify2(func: any, arg0: any, arg1: any): () => any;
