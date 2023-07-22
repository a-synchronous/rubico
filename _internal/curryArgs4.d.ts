export = curryArgs4;
/**
 * @name curryArgs4
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol('placeholder')
 *
 * curryArgs4(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any
 *   arg3 __|any,
 * ) -> function
 * ```
 *
 * @description
 * Curry arguments for a 4-ary function. Arguments are supplied in placeholder position as an array.
 *
 * Note: at least one argument must be the placeholder
 */
declare function curryArgs4(baseFunc: any, arg0: any, arg1: any, arg2: any, arg3: any): (...args: any[]) => any;
