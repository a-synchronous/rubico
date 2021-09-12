/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const objectValues = Object.values

const isPromise = value => value != null && typeof value.then == 'function'

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

const thunkify3 = (func, arg0, arg1, arg2) => function thunk() {
  return func(arg0, arg1, arg2)
}

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

const always = value => function getter() { return value }

const arrayFindAsync = async function (array, predicate, index) {
  const length = array.length
  while (++index < length) {
    const item = array[index]
    let predication = predicate(item)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return item
    }
  }
  return undefined
}

const arrayFind = function (array, predicate) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const item = array[index],
      predication = predicate(item)
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        always(item),
        thunkify3(arrayFindAsync, array, predicate, index)))
    } else if (predication) {
      return item
    }
  }
  return undefined
}

const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

const iteratorFindAsync = async function (iterator, predicate) {
  let iteration = iterator.next()
  while (!iteration.done) {
    const item = iteration.value
    let predication = predicate(item)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return item
    }
    iteration = iterator.next()
  }
  return undefined
}

const iteratorFind = function (iterator, predicate) {
  let iteration = iterator.next()
  while (!iteration.done) {
    const item = iteration.value,
      predication = predicate(item)
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        always(item),
        thunkify2(iteratorFindAsync, iterator, predicate)))
    } else if (predication) {
      return item
    }
    iteration = iterator.next()
  }
  return undefined
}

const asyncIteratorFind = async function (asyncIterator, predicate) {
  let iteration = await asyncIterator.next()
  while (!iteration.done) {
    const item = iteration.value
    let predication = predicate(item)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return item
    }
    iteration = await asyncIterator.next()
  }
  return undefined
}

const find = predicate => function finding(value) {
  if (isArray(value)) {
    return arrayFind(value, predicate)
  }
  if (value == null) {
    return undefined
  }
  if (typeof value[symbolIterator] == 'function') {
    return iteratorFind(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorFind(value[symbolAsyncIterator](), predicate)
  }
  if (typeof value.find == 'function') {
    return value.find(predicate)
  }
  if (value.constructor == Object) {
    return arrayFind(objectValues(value), predicate)
  }
  return undefined
}

export default find
