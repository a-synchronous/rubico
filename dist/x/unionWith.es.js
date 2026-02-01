/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

const isPromise = value => value != null && typeof value.then == 'function'

const promiseAll = Promise.all.bind(Promise)

const __ = Symbol.for('placeholder')

// argument resolver for curry3
const curry3ResolveArg0 = (
  baseFunc, arg1, arg2,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1, arg2)
}

// argument resolver for curry3
const curry3ResolveArg1 = (
  baseFunc, arg0, arg2,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1, arg2)
}

// argument resolver for curry3
const curry3ResolveArg2 = (
  baseFunc, arg0, arg1,
) => function arg2Resolver(arg2) {
  return baseFunc(arg0, arg1, arg2)
}

const curry3 = function (baseFunc, arg0, arg1, arg2) {
  if (arg0 == __) {
    return curry3ResolveArg0(baseFunc, arg1, arg2)
  }
  if (arg1 == __) {
    return curry3ResolveArg1(baseFunc, arg0, arg2)
  }
  return curry3ResolveArg2(baseFunc, arg0, arg1)
}

const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

const thunkify4 = (func, arg0, arg1, arg2, arg3) => function thunk() {
  return func(arg0, arg1, arg2, arg3)
}

const funcConcatSync = (
  funcA, funcB,
) => function pipedFunction(...args) {
  return funcB(funcA(...args))
}

const callPropUnary = (value, property, arg0) => value[property](arg0)

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

const arrayPush = function (array, value) {
  array.push(value)
  return array
}

const always = value => function getter() { return value }

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

const getArg1 = (arg0, arg1) => arg1

const identity = value => value

const asyncIteratorForEach = async function (asyncIterator, callback) {
  const promises = []
  for await (const element of asyncIterator) {
    const operation = callback(element)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? asyncIterator
    : promiseAll(promises).then(always(asyncIterator))
}

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const arrayFlatten = function (array) {
  const length = array.length,
    promises = [],
    result = []
  let index = -1

  while (++index < length) {
    const element = array[index]
    if (isArray(element)) {
      const elementLength = element.length
      let elementIndex = -1
      while (++elementIndex < elementLength) {
        result.push(element[elementIndex])
      }
    } else if (element == null) {
      result.push(element)
    } else if (typeof element.then == 'function') {
      promises.push(element.then(curry2(arrayPush, result, __)))
    } else if (typeof element[symbolIterator] == 'function') {
      for (const subElement of element) {
        result.push(subElement)
      }
    } else if (typeof element[symbolAsyncIterator] == 'function') {
      promises.push(asyncIteratorForEach(
        element[symbolAsyncIterator](), curry2(arrayPush, result, __)))
    } else if (typeof element.chain == 'function') {
      const monadValue = element.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(curry2(arrayPush, result, __)))
        : result.push(monadValue)
    } else if (typeof element.flatMap == 'function') {
      const monadValue = element.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(curry2(arrayPush, result, __)))
        : result.push(monadValue)
    } else if (typeof element.reduce == 'function') {
      const folded = element.reduce(funcConcatSync(
        getArg1, curry2(arrayPush, result, __)), null)
      isPromise(folded) && promises.push(folded)
    } else if (element.constructor == Object) {
      for (const key in element) {
        result.push(element[key])
      }
    } else {
      result.push(element)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

const noop = function () {}

const arrayIncludesWith = function (array, value, comparator) {
  const length = array.length,
    promises = []
  let index = -1
  while (++index < length) {
    const predication = comparator(value, array[index])
    if (isPromise(predication)) {
      promises.push(predication)
    } else if (predication) {
      return true
    }
  }
  return promises.length == 0 ? false
    : promiseAll(promises).then(curry3(callPropUnary, __, 'some', Boolean))
}

const arrayUniqWithAsync = async function (array, comparator, result, index) {
  const length = array.length
  while (++index < length) {
    const element = array[index],
      elementAlreadyExists = arrayIncludesWith(result, element, comparator)
    if (!(
      isPromise(elementAlreadyExists) ? await elementAlreadyExists : elementAlreadyExists
    )) {
      result.push(element)
    }
  }
  return result
}

const arrayUniqWith = function (array, comparator) {
  const length = array.length,
    result = []
  let index = -1
  while (++index < length) {
    const element = array[index],
      elementAlreadyExists = arrayIncludesWith(result, element, comparator)
    if (isPromise(elementAlreadyExists)) {
      return elementAlreadyExists.then(funcConcatSync(
        curry3(thunkConditional, __, noop, thunkify2(arrayPush, result, element)),
        thunkify4(arrayUniqWithAsync, array, comparator, result, index)))
    } else if (!elementAlreadyExists) {
      result.push(element)
    }
  }
  return result
}

const unionWith = comparator => function unioning(value) {
  if (isArray(value)) {
    return arrayUniqWith(arrayFlatten(value), comparator)
  }
  throw new TypeError(`${value} is not an Array`)
}

export default unionWith
