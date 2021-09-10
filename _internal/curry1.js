const __ = require('./placeholder')

/**
 * @name curry1
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol(placeholder)
 *
 * var func function,
 *   arg0 __|any,
 *   _arg0 __|any
 *
 * curry1(func, arg0) -> curried _arg0=>function|any
 * ```
 *
 * @description
 * Curry a unary function.
 */
const curry1 = (func, arg0) => arg0 == __
  ? _arg0 => curry1(func, _arg0)
  : func(arg0)

module.exports = curry1
