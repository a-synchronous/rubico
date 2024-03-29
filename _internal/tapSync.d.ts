export = tapSync;
/**
 * @name tapSync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * tapSync<
 *   tapper function,
 *   args ...any,
 * >(tapper)(...args) -> args[0]
 * ```
 *
 * @description
 * Call a function with arguments, returning the first argument. Promises are not handled.
 */
declare function tapSync(func: any): (...args: any[]) => any;
