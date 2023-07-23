export = thunkify5;
/**
 * @name thunkify5
 *
 * @synopsis
 * ```coffeescript [specscript]
 * thunkify5<
 *   arg0 any,
 *   arg1 any,
 *   arg2 any,
 *   arg3 any,
 *   arg4 any,
 *   func (arg0, arg1, arg2, arg3, arg4)=>any,
 * >(func, arg0, arg1, arg2, arg3, arg4) -> thunk ()=>func(arg0, arg1, arg2, arg3, arg4)
 * ```
 *
 * @description
 * Create a thunk from a function and five arguments.
 */
declare function thunkify5(func: any, arg0: any, arg1: any, arg2: any, arg3: any, arg4: any): () => any;
