/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, get) {
  if (typeof module == 'object') (module.exports = get) // CommonJS
  else if (typeof define == 'function') define(() => get) // AMD
  else (root.get = get) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

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

const get = (path, defaultValue) => function getter(value) {
  const result = value == null ? undefined : getByPath(value, path)
  return result === undefined
    ? typeof defaultValue == 'function' ? defaultValue(value) : defaultValue
    : result
}

return get
}())))
