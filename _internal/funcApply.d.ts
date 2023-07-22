export = funcApply;
/**
 * @name funcApply
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcApply<
 *   args ...any,
 *   func ...args=>any,
 * >(func, args) -> func(...args)
 * ```
 *
 * @description
 * Apply arguments to a function.
 */
declare function funcApply(func: any, args: any): any;
