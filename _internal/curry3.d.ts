export = curry3;
/**
 * @name curry3
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol('placeholder')
 *
 * curry3(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any
 * ) -> function
 * ```
 *
 * @description
 * Curry a 3-ary function.
 *
 * Note: exactly one argument must be the placeholder
 */
declare function curry3(baseFunc: any, arg0: any, arg1: any, arg2: any): (arg0: any) => any;
