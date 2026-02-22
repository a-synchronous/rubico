/**
 * @name funcApply2
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcApply2<
 *   func function,
 *   context object,
 *   args Array
 * >(func, args) -> func(...args)
 * ```
 *
 * @description
 * Apply arguments to a function with context.
 */
const funcApply2 = (func, context, args) => func.apply(context, args)

module.exports = funcApply2
