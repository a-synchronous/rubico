/**
 * rubico v2.7.5
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2025 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isPromise = value => value != null && typeof value.then == 'function'

const isArray = Array.isArray

const memoizeCappedUnary = function (func, cap) {
  const cache = new Map(),
    memoized = function memoized(arg0) {
      if (cache.has(arg0)) {
        return cache.get(arg0)
      }
      const result = func(arg0)
      cache.set(arg0, result)
      if (cache.size > cap) {
        cache.clear()
      }
      return result
    }
  memoized.cache = cache
  return memoized
}

// a[0].b.c
const pathDelimiters = /[.|[|\]]+/

const parsePropertyPath = function (pathString) {
  const pathStringLastIndex = pathString.length - 1,
    firstChar = pathString[0],
    lastChar = pathString[pathStringLastIndex],
    isFirstCharLeftBracket = firstChar == '[',
    isLastCharRightBracket = lastChar == ']'

  if (isFirstCharLeftBracket && isLastCharRightBracket) {
    return pathString.slice(1, pathStringLastIndex).split(pathDelimiters)
  } else if (isFirstCharLeftBracket) {
    return pathString.slice(1).split(pathDelimiters)
  } else if (isLastCharRightBracket) {
    return pathString.slice(0, pathStringLastIndex).split(pathDelimiters)
  }
  return pathString.split(pathDelimiters)
}

// memoized version of parsePropertyPath, max cache size 500
const memoizedCappedParsePropertyPath = memoizeCappedUnary(parsePropertyPath, 500)

const propertyPathToArray = path => isArray(path) ? path
  : typeof path == 'string' ? memoizedCappedParsePropertyPath(path)
  : [path]

const getByPath = function (value, path) {
  const propertyPathArray = propertyPathToArray(path),
    length = propertyPathArray.length
  let index = -1,
    result = value
  while (++index < length) {
    result = result[propertyPathArray[index]]
    if (result == null) {
      return undefined
    }
  }
  return result
}

const deleteByPath = function (object, path) {
  if (object == null) {
    return undefined
  }
  const pathArray = propertyPathToArray(path),
    lengthMinusOne = pathArray.length - 1
  let index = -1,
    result = object
  while (++index < lengthMinusOne) {
    result = result[pathArray[index]]
    if (result == null) {
      return undefined
    }
  }
  const property = pathArray[index]
  if (result != null && property in result) {
    delete result[property]
  }
  return undefined
}

// objectCopyDeep(array Array) -> copied Array
const objectCopyDeep = function (object) {
  const result = {}
  for (const key in object) {
    const element = object[key]
    if (isArray(element)) {
      result[key] = arrayCopyDeep(element)
    } else if (element != null && element.constructor == Object) {
      result[key] = objectCopyDeep(element)
    } else {
      result[key] = element
    }
  }
  return result
}

// arrayCopyDeep(array Array) -> copied Array
const arrayCopyDeep = function (array) {
  const length = array.length,
    result = []
  let index = -1
  while (++index < length) {
    const element = array[index]
    if (isArray(element)) {
      result[index] = arrayCopyDeep(element)
    } else if (element != null && element.constructor == Object) {
      result[index] = objectCopyDeep(element)
    } else {
      result[index] = element
    }
  }
  return result
}

const copyDeep = function (value) {
  if (isArray(value)) {
    return arrayCopyDeep(value)
  }
  if (value == null) {
    return value
  }
  if (value.constructor == Object) {
    return objectCopyDeep(value)
  }
  return value
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

// _omit(source Object, paths Array<string>) -> result Object
const _omit = function (source, paths) {
  const pathsLength = paths.length,
    result = copyDeep(source)
  let pathsIndex = -1
  while (++pathsIndex < pathsLength) {
    deleteByPath(result, paths[pathsIndex])
  }
  return result
}

const omit = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_omit, __, arg0)
  }
  if (isPromise(arg0)) {
    return arg0.then(curry2(_omit, __, arg1))
  }
  return _omit(arg0, arg1)
}

export default omit
