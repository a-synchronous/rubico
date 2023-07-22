export = thunkify1;
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
declare function thunkify1(func: any, arg0: any): () => any;
