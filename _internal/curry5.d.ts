export = curry5;
/**
 * @name curry5
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol('placeholder')
 *
 * curry5(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any,
 *   arg3 __|any,
 *   arg4 __|any,
 * ) -> function
 * ```
 *
 * @description
 * Curry a 5-ary function.
 *
 * Note: exactly one argument must be the placeholder
 */
declare function curry5(baseFunc: any, arg0: any, arg1: any, arg2: any, arg3: any, arg4: any): (arg0: any) => any;
