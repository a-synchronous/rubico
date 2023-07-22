export = thunkifyArgs;
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
declare function thunkifyArgs(func: any, args: any): () => any;
