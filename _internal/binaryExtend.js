const isArray = require('./isArray')
const isBinary = require('./isBinary')
const bufferAlloc = require('./bufferAlloc')
const globalThisHasBuffer = require('./globalThisHasBuffer')

/**
 * @name _binaryExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _binaryExtend(
 *   typedArray TypedArray,
 *   array Array|TypedArray,
 * ) -> concatenatedTypedArray
 * ```
 *
 * @description
 * Extend a typed array with an array of values.
 */
const _binaryExtend = function (typedArray, array) {
  const offset = typedArray.length
  const result = globalThisHasBuffer && typedArray.constructor == Buffer
    ? bufferAlloc(offset + array.length)
    : new typedArray.constructor(offset + array.length)
  result.set(typedArray)
  result.set(array, offset)
  return result
}

/**
 * @name binaryExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * binaryExtend(
 *   typedArray TypedArray,
 *   array Array|TypedArray|any,
 * ) -> concatenatedTypedArray
 * ```
 *
 * @description
 * Types branching for _binaryExtend
 */
const binaryExtend = function (typedArray, array) {
  if (isArray(array) || isBinary(array)) {
    return _binaryExtend(typedArray, array)
  }
  return _binaryExtend(typedArray, [array])
}

module.exports = binaryExtend
