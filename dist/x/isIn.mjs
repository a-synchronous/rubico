/**
 * rubico v1.9.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

const sameValueZero = function (left, right) {
  return left === right || (left !== left && right !== right)
}

// (object Object, value any) -> boolean
const objectIncludes = function (object, value) {
  for (const key in object) {
    if (sameValueZero(value, object[key])) {
      return true
    }
  }
  return false
}

const includes = value => function includesValue(container) {
  if (container == null) {
    return false
  }
  if (typeof container.includes == 'function') {
    return container.includes(value)
  }
  if (container.constructor == Object) {
    return objectIncludes(container, value)
  }
  return false
}

const __ = Symbol.for('placeholder')

// argument resolver for curry2
const curry2ResolveArg0 = (
  baseFunc, arg1,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1)
}

// argument resolver for curry2
const curry2ResolveArg1 = (
  baseFunc, arg0,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1)
}

const curry2 = function (baseFunc, arg0, arg1) {
  return arg0 == __
    ? curry2ResolveArg0(baseFunc, arg1)
    : curry2ResolveArg1(baseFunc, arg0)
}

const _isIn = function (value, container) {
  if (!container) {
    return false
  }
  if (container.constructor == Set) {
    return container.has(value)
  }
  if (container.constructor == Map) {
    return Array.from(container.values()).includes(value)
  }

  return includes(value)(container)
}

const isIn = (...args) => {
  const container = args.pop()
  if (args.length > 0) {
    return _isIn(args[0], container)
  }
  return curry2(_isIn, __, container)
}

export default isIn
