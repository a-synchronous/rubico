/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

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

const isObject = value => {
  if (value == null) {
    return false
  }

  const typeofValue = typeof value
  return (typeofValue == 'object') || (typeofValue == 'function')
}

const setByPath = function (obj, value, path) {
  if (!isObject(obj)){
    return obj
  }
  const pathArray = propertyPathToArray(path)
  const pathLength = pathArray.length
  const lastIndex = pathLength - 1
  const result = { ...obj }
  let nested = result
  let index = -1
  while (++index < pathLength){
    const pathKey = pathArray[index]
    if (index == lastIndex){
      nested[pathKey] = value
    } else {
      const existingNextNested = nested[pathKey]
      const nextNested = isArray(existingNextNested)
        ? existingNextNested.slice() : { ...existingNextNested }
      nested[pathKey] = nextNested
      nested = nextNested
    }
  }
  return result
}

const pick = keys => function picking(source) {
  if (source == null) {
    return source
  }
  const keysLength = keys.length
  let result = {}
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex],
      value = getByPath(source, key)
    if (value != null) {
      result = setByPath(result, value, key)
    }
  }
  return result
}

export default pick
