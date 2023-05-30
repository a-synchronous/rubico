/**
 * @name funcCall
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcCall(func function, context Object, ...args) -> any
 * ```
 *
 * @description
 * Apply arguments to a function.
 */
const funcCall = (func, context, ...args) => func.call(context, ...args)

module.exports = funcCall
