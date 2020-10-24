/**
 * rubico v1.5.19
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

const objectKeysLength = object => {
  let numKeys = 0
  for (const _ in object) {
    numKeys += 1
  }
  return numKeys
}

const symbolIterator = Symbol.iterator

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

export default isDeepEqual
