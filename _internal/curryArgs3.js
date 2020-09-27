const __ = require('./placeholder')

// argument resolver for curryArgs3
const curryArgs3ResolveArgs0 = (
  baseFunc, arg1, arg2,
) => function args0Resolver(...args) {
  return baseFunc(args, arg1, arg2)
}

// argument resolver for curryArgs3
const curryArgs3ResolveArgs1 = (
  baseFunc, arg0, arg2,
) => function arg1Resolver(...args) {
  return baseFunc(arg0, args, arg2)
}

// argument resolver for curryArgs3
const curryArgs3ResolveArgs2 = (
  baseFunc, arg0, arg1,
) => function arg2Resolver(...args) {
  return baseFunc(arg0, arg1, args)
}

/**
 * @name curryArgs3
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol('placeholder')
 *
 * curryArgs3(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any
 * ) -> function
 * ```
 *
 * @description
 * Curry arguments for a 3-ary function. Arguments are supplied in placeholder position as an array.
 *
 * Note: at least one argument must be the placeholder
 */
const curryArgs3 = function (baseFunc, arg0, arg1, arg2) {
  if (arg0 == __) {
    return curryArgs3ResolveArgs0(baseFunc, arg1, arg2)
  }
  if (arg1 == __) {
    return curryArgs3ResolveArgs1(baseFunc, arg0, arg2)
  }
  return curryArgs3ResolveArgs2(baseFunc, arg0, arg1)
}

module.exports = curryArgs3
