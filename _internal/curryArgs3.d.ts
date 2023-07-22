export = curryArgs3;
/**
 * @name curryArgs3
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol('placeholder')
 *
 * curryArgs3(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any
 * ) -> function
 * ```
 *
 * @description
 * Curry arguments for a 3-ary function. Arguments are supplied in placeholder position as an array.
 *
 * Note: at least one argument must be the placeholder
 */
declare function curryArgs3(baseFunc: any, arg0: any, arg1: any, arg2: any): (...args: any[]) => any;
