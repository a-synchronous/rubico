export = thunkify4;
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
declare function thunkify4(func: any, arg0: any, arg1: any, arg2: any, arg3: any): () => any;
