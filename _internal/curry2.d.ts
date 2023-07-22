export = curry2;
/**
 * @name curry2
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol('placeholder')
 *
 * curry2(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 * ) -> function
 * ```
 *
 * @description
 * Curry a binary function.
 *
 * Note: exactly one argument must be the placeholder
 */
declare function curry2(baseFunc: any, arg0: any, arg1: any): (arg0: any) => any;
