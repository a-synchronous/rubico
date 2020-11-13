const isArray = require('../_internal/isArray')
const objectKeysLength = require('../_internal/objectKeysLength')
const symbolIterator = require('../_internal/symbolIterator')
const sameValueZero = require('../_internal/sameValueZero')

/**
 * @name areIteratorsDeepEqual
 *
 * @synopsis
 * areIteratorsDeepEqual(left Iterator, right Iterator) -> boolean
 */
const areIteratorsDeepEqual = function (leftIterator, rightIterator) {
  let leftIteration = leftIterator.next(),
    rightIteration = rightIterator.next()
  if (leftIteration.done != rightIteration.done) {
    return false
  }
  while (!leftIteration.done) {
    if (!isDeepEqual(leftIteration.value, rightIteration.value)) {
      return false
    }
    leftIteration = leftIterator.next()
    rightIteration = rightIterator.next()
  }
  return rightIteration.done
}

/**
 * @name areObjectsDeepEqual
 *
 * @synopsis
 * areObjectsDeepEqual(left Object, right Object) -> boolean
 */
const areObjectsDeepEqual = function (leftObject, rightObject) {
  const leftKeysLength = objectKeysLength(leftObject),
    rightKeysLength = objectKeysLength(rightObject)
  if (leftKeysLength != rightKeysLength) {
    return false
  }
  for (const key in leftObject) {
    if (!isDeepEqual(leftObject[key], rightObject[key])) {
      return false
    }
  }
  return true
}

/**
 * @name areArraysDeepEqual
 *
 * @synopsis
 * areArraysDeepEqual(left Array, right Array) -> boolean
 */
const areArraysDeepEqual = function (leftArray, rightArray) {
  const length = leftArray.length
  if (rightArray.length != length) {
    return false
  }
  let index = -1
  while (++index < length) {
    if (!isDeepEqual(leftArray[index], rightArray[index])) {
      return false
    }
  }
  return true
}

/**
 * @name isDeepEqual
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Nested<T> = Array<Array<T>|Object<T>|Iterable<T>|T>|Object<Array<T>|Object<T>|Iterable<T>|T>
 *
 * var left Nested,
 *   right Nested
 *
 * isDeepEqual(left, right) -> boolean
 * ```
 *
 * @description
 * Check two values for deep [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero) equality.
 *
 * ```javascript [playground]
 * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
 *
 * console.log(
 *   isDeepEqual({ a: 1, b: 2, c: [3] }, { a: 1, b: 2, c: [3] }),
 * ) // true
 *
 * console.log(
 *   isDeepEqual({ a: 1, b: 2, c: [3] }, { a: 1, b: 2, c: [5] }),
 * ) // false
 * ```
 */
const isDeepEqual = function (left, right) {
  const isLeftArray = isArray(left),
    isRightArray = isArray(right)
  if (isLeftArray || isRightArray) {
    return isLeftArray && isRightArray
      && areArraysDeepEqual(left, right)
  }
  if (left == null || right == null) {
    return sameValueZero(left, right)
  }

  const isLeftString = typeof left == 'string' || left.constructor == String,
    isRightString = typeof right == 'string' || right.constructor == String
  if (isLeftString || isRightString) {
    return sameValueZero(left, right)
  }
  const isLeftIterable = typeof left[symbolIterator] == 'function',
    isRightIterable = typeof right[symbolIterator] == 'function'
  if (isLeftIterable || isRightIterable) {
    return isLeftIterable && isRightIterable
      && areIteratorsDeepEqual(left[symbolIterator](), right[symbolIterator]())
  }

  const isLeftObject = left.constructor == Object,
    isRightObject = right.constructor == Object
  if (isLeftObject || isRightObject) {
    return isLeftObject && isRightObject
      && areObjectsDeepEqual(left, right)
  }
  return sameValueZero(left, right)
}

module.exports = isDeepEqual
