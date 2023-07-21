const __ = require('./placeholder')

// argument resolver for curryArgs4
const curryArgs4ResolveArgs0 = (
  baseFunc, arg1, arg2, arg3,
) => function args0Resolver(...args) {
  return baseFunc(args, arg1, arg2, arg3)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs1 = (
  baseFunc, arg0, arg2, arg3,
) => function args1Resolver(...args) {
  return baseFunc(arg0, args, arg2, arg3)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs2 = (
  baseFunc, arg0, arg1, arg3,
) => function args2Resolver(...args) {
  return baseFunc(arg0, arg1, args, arg3)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs3 = (
  baseFunc, arg0, arg1, arg2,
) => function args3Resolver(...args) {
  return baseFunc(arg0, arg1, arg2, args)
}

/**
 * @name curryArgs4
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol('placeholder')
 *
 * curryArgs4(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any
 *   arg3 __|any,
 * ) -> function
 * ```
 *
 * @description
 * Curry arguments for a 4-ary function. Arguments are supplied in placeholder position as an array.
 *
 * Note: at least one argument must be the placeholder
 */
const curryArgs4 = function (baseFunc, arg0, arg1, arg2, arg3) {
  if (arg0 == __) {
    return curryArgs4ResolveArgs0(baseFunc, arg1, arg2, arg3)
  }
  if (arg1 == __) {
    return curryArgs4ResolveArgs1(baseFunc, arg0, arg2, arg3)
  }
  if (arg2 == __) {
    return curryArgs4ResolveArgs2(baseFunc, arg0, arg1, arg3)
  }
  return curryArgs4ResolveArgs3(baseFunc, arg0, arg1, arg2)
}

module.exports = curryArgs4
