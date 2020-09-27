/**
 * @name funcApply
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcApply<
 *   args ...any,
 *   func ...args=>any,
 * >(func, args) -> func(...args)
 * ```
 *
 * @description
 * Apply arguments to a function.
 */
const funcApply = (func, args) => func(...args)
