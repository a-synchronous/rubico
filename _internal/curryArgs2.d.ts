export = curryArgs2;
/**
 * @name curryArgs2
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type __ = Symbol('placeholder')
 *
 * curryArgs2(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 * ) -> function
 * ```
 *
 * @description
 * Curry arguments for a 2-ary function. Arguments are supplied in placeholder position as an array.
 *
 * Note: at least one argument must be the placeholder
 */
declare function curryArgs2(baseFunc: any, arg0: any, arg1: any): (...args: any[]) => any;
