const isArray = require('./_internal/isArray')
const memoizeCappedUnary = require('./_internal/memoizeCappedUnary')

// a[0].b.c
const pathStringSplitRegex = /[.|[|\]]+/

/**
 * @name pathStringSplit
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pathStringSplit(pathString string) -> Array<string>
 * ```
 *
 * @note
 * a[0].b.c
 * a.0.b[0][1].c
 */
const pathStringSplit = function (pathString) {
  const pathStringLastIndex = pathString.length - 1,
    firstChar = pathString[0],
    lastChar = pathString[pathStringLastIndex],
    isFirstCharLeftBracket = firstChar == '[',
    isLastCharRightBracket = lastChar == ']'

  if (isFirstCharLeftBracket && isLastCharRightBracket) {
    return pathString.slice(1, pathStringLastIndex).split(pathStringSplitRegex)
  } else if (isFirstCharLeftBracket) {
    return pathString.slice(1).split(pathStringSplitRegex)
  } else if (isLastCharRightBracket) {
    return pathString.slice(0, pathStringLastIndex).split(pathStringSplitRegex)
  }
  return pathString.split(pathStringSplitRegex)
}

// memoized version of pathStringSplit, max cache size 500
const memoizedCappedPathStringSplit = memoizeCappedUnary(pathStringSplit, 500)

/**
 * @name pathToArray
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pathToArray(path string|number|Array<string|number>) -> Array
 * ```
 */
const pathToArray = path => isArray(path) ? path
  : typeof path == 'string' ? memoizedCappedPathStringSplit(path)
  : [path]

/**
 * @name getByPath
 *
 * @synopsis
 * ```coffeescript [specscript]
 * getByPath<
 *   value any,
 *   path string|number|Array<string|number>,
 * >(value, path) -> valueAtPath any
 * ```
 */
const getByPath = function (value, path) {
  const pathArray = pathToArray(path),
    length = pathArray.length
  let index = -1,
    result = value
  while (++index < length) {
    result = result[pathArray[index]]
    if (result == null) {
      return undefined
    }
  }
  return result
}


/**
 * @name get
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value any,
 *   path string|number|Array<string|number>,
 *   defaultValue (value=>any)|any
 *
 * get(path, defaultValue?) -> getter value=>any
 * ```
 *
 * @description
 * Create a getter that accesses a property on a value denoted by path.
 *
 * ```javascript [playground]
 * console.log(
 *   get('hello')({ hello: 'world' }),
 * ) // world
 * ```
 *
 * It is possible to return a default value on not found by supplying the value or resolver of such value as the second parameter.
 *
 * ```javascript [playground]
 * console.log(
 *   get('hello', 'default')({ foo: 'bar' }),
 * ) // default
 *
 * console.log(
 *   get('hello', object => object.foo)({ foo: 'bar' }),
 * ) // bar
 * ```
 *
 * `get` supports three types of path patterns for nested property access.
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * const nestedABC0 = { a: { b: { c: ['hello'] } } }
 *
 * console.log(
 *   get('a.b.c[0]')(nestedABC0),
 * ) // hello
 *
 * const nested00000 = [[[[['foo']]]]]
 *
 * console.log(
 *   get('0.0.0.0.0')(nested00000),
 * ) // foo
 *
 * console.log(
 *   get('[0][0][0][0][0]')(nested00000),
 * ) // foo
 *
 * console.log(
 *   get([0, 0, 0, 0, 0])(nested00000),
 * ) // foo
 * ```
 */
const get = (path, defaultValue) => function getter(value) {
  const result = value == null ? undefined : getByPath(value, path)
  return result === undefined
    ? typeof defaultValue == 'function' ? defaultValue(value) : defaultValue
    : result
}

module.exports = get
