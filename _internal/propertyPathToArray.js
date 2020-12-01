const isArray = require('./isArray')
const memoizeCappedUnary = require('./memoizeCappedUnary')

// a[0].b.c
const pathDelimiters = /[.|[|\]]+/

/**
 * @name parsePropertyPath
 *
 * @synopsis
 * ```coffeescript [specscript]
 * parsePropertyPath(pathString string) -> Array<string>
 * ```
 *
 * @note
 * a[0].b.c
 * a.0.b[0][1].c
 */
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

/**
 * @name propertyPathToArray
 *
 * @synopsis
 * ```coffeescript [specscript]
 * propertyPathToArray(path string|number|Array<string|number>) -> Array
 * ```
 */
const propertyPathToArray = path => isArray(path) ? path
  : typeof path == 'string' ? memoizedCappedParsePropertyPath(path)
  : [path]

module.exports = propertyPathToArray
