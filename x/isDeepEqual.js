const isArray = require('../_internal/isArray')
const objectKeysLength = require('../_internal/objectKeysLength')
const symbolIterator = require('../_internal/symbolIterator')

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
 * Check two values for deep strict equality.
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
const isDeepEqual = function (leftItem, rightItem) {
  if (isArray(leftItem) && isArray(rightItem)) {
    return areArraysDeepEqual(leftItem, rightItem)
  } else if (
    typeof leftItem == 'object' && typeof rightItem == 'object'
      && leftItem != null && rightItem != null
      && leftItem.constructor == rightItem.constructor
      && typeof leftItem[symbolIterator] == 'function'
      && typeof rightItem[symbolIterator] == 'function'
  ) {
    return areIteratorsDeepEqual(
      leftItem[symbolIterator](), rightItem[symbolIterator]())
  } else if (leftItem == null || rightItem == null) {
    return leftItem === rightItem
  } else if (
    leftItem.constructor == Object && rightItem.constructor == Object
  ) {
    return areObjectsDeepEqual(leftItem, rightItem)
  }
  return leftItem === rightItem
}

module.exports = isDeepEqual
