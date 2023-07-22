export = thunkify3;
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
declare function thunkify3(func: any, arg0: any, arg1: any, arg2: any): () => any;
