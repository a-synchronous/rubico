const __ = require('./placeholder')

// argument resolver for curryArgs2
const curryArgs2ResolveArgs0 = (
  baseFunc, arg1, arg2,
) => function args0Resolver(...args) {
  return baseFunc(args, arg1)
}

// argument resolver for curryArgs2
const curryArgs2ResolveArgs1 = (
  baseFunc, arg0, arg2,
) => function arg1Resolver(...args) {
  return baseFunc(arg0, args)
}

/**
 * @name curryArgs2
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type __ = Symbol('placeholder')
 *
 * curryArgs2(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 * ) -> function
 * ```
 *
 * @description
 * Curry arguments for a 2-ary function. Arguments are supplied in placeholder position as an array.
 *
 * Note: at least one argument must be the placeholder
 */
const curryArgs2 = function (baseFunc, arg0, arg1) {
  if (arg0 == __) {
    return curryArgs2ResolveArgs0(baseFunc, arg1)
  }
  return curryArgs2ResolveArgs1(baseFunc, arg0)
}

module.exports = curryArgs2
