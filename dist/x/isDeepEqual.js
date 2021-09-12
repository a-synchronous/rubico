/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, isDeepEqual) {
  if (typeof module == 'object') (module.exports = isDeepEqual) // CommonJS
  else if (typeof define == 'function') define(() => isDeepEqual) // AMD
  else (root.isDeepEqual = isDeepEqual) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isArray = Array.isArray

const objectKeysLength = object => {
  let numKeys = 0
  for (const _ in object) {
    numKeys += 1
  }
  return numKeys
}

const symbolIterator = Symbol.iterator

const sameValueZero = function (left, right) {
  return left === right || (left !== left && right !== right)
}

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

return isDeepEqual
}())))
