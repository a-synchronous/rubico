/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const __ = Symbol.for('placeholder')

const isArray = Array.isArray

const isPromise = value => value != null && typeof value.then == 'function'

const promiseAll = Promise.all.bind(Promise)

const spread2 = func => function spreading2([arg0, arg1]) {
  return func(arg0, arg1)
}

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

const areValuesDeepEqual = function (left, right) {
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

const isDeepEqual = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function isDeepEqualBy(value) {
      const leftValue = left(value),
        rightValue = right(value)
      const isLeftPromise = isPromise(leftValue),
        isRightPromise = isPromise(rightValue)
      if (isLeftPromise && isRightPromise) {
        return promiseAll([
          leftValue,
          rightValue,
        ]).then(spread2(areValuesDeepEqual))
      }
      if (isLeftPromise) {
        return leftValue.then(curry2(areValuesDeepEqual, __, rightValue))
      }
      if (isRightPromise) {
        return rightValue.then(curry2(areValuesDeepEqual, leftValue, __))
      }
      return areValuesDeepEqual(leftValue, rightValue)
    }
  }

  if (isLeftResolver) {
    return function isDeepEqualBy(value) {
      const leftValue = left(value)
      return isPromise(leftValue)
        ? leftValue.then(curry2(areValuesDeepEqual, __, right))
        : areValuesDeepEqual(leftValue, right)
    }
  }

  if (isRightResolver) {
    return function isDeepEqualBy(value) {
      const rightValue = right(value)
      return isPromise(rightValue)
        ? rightValue.then(curry2(areValuesDeepEqual, left, __))
        : areValuesDeepEqual(left, rightValue)
    }
  }

  return areValuesDeepEqual(left, right)
}

export default isDeepEqual
