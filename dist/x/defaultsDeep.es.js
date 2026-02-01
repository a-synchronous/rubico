/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

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

function arrayDefaultsDeepFromArray(data, defaults) {
  const defaultArrayLength = defaults.length,
    result = data.slice()
  let index = -1
  while (++index < defaultArrayLength) {
    const element = data[index],
      defaultElement = defaults[index]
    if (isArray(element) && isArray(defaultElement)) {
      result[index] = arrayDefaultsDeepFromArray(element, defaultElement)
    } else if (element == null) {
      result[index] = defaultElement
    } else if (defaultElement == null) {
      result[index] = element
    } else if (element.constructor == Object && defaultElement.constructor == Object) {
      result[index] = objectDefaultsDeepFromObject(element, defaultElement)
    } else {
      result[index] = element
    }
  }
  return result
}

function objectDefaultsDeepFromObject(data, defaults) {
  const result = { ...data }
  for (const key in defaults) {
    const element = data[key],
      defaultElement = defaults[key]
    if (isArray(element) && isArray(defaultElement)) {
      result[key] = arrayDefaultsDeepFromArray(element, defaultElement)
    } else if (element == null) {
      result[key] = defaultElement
    } else if (defaultElement == null) {
      result[key] = element
    } else if (element.constructor == Object && defaultElement.constructor == Object) {
      result[key] = objectDefaultsDeepFromObject(element, defaultElement)
    } else {
      result[key] = element
    }
  }
  return result
}

function _defaultsDeep(data, defaults) {
  if (isArray(data) && isArray(defaults)) {
    return arrayDefaultsDeepFromArray(data, defaults)
  }
  if (data == null || defaults == null) {
    return data
  }
  if (data.constructor == Object && defaults.constructor == Object) {
    return objectDefaultsDeepFromObject(data, defaults)
  }
  return data
}

function defaultsDeep(...args) {
  if (args.length == 1) {
    return curry2(_defaultsDeep, __, args[0])
  }
  if (args.length == 2) {
    return _defaultsDeep(...args)
  }
  throw new TypeError('Invalid number of arguments')
}

export default defaultsDeep
