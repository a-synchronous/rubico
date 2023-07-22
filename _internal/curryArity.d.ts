export = curryArity;
/**
 * @name curryArity
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol(placeholder)
 *
 * var arity number,
 *   func function,
 *   args Array<__|any>,
 *   curried function
 *
 * curryArity(arity, func, args) -> curried|any
 * ```
 *
 * @description
 * Create a curried version of a function with specified arity.
 */
declare function curryArity(arity: any, func: any, args: any): any;
