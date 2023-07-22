export = curry4;
/**
 * @name curry4
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol('placeholder')
 *
 * curry4(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any,
 *   arg3 __|any,
 * ) -> function
 * ```
 *
 * @description
 * Curry a 4-ary function.
 *
 * Note: exactly one argument must be the placeholder
 */
declare function curry4(baseFunc: any, arg0: any, arg1: any, arg2: any, arg3: any): (arg0: any) => any;
