const timeInLoop = require('../x/timeInLoop')
const { map } = require('..')
const R = require('ramda')
const _ = require('lodash')

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const objectKeys = Object.keys

const promiseAll = Promise.all.bind(Promise)

const promiseRace = Promise.race.bind(Promise)

const isPromise = value => value != null && typeof value.then == 'function'

const asyncIteratorToArray = async asyncIter => {
  const result = []
  for await (const item of asyncIter) result.push(item)
  return result
}


const arrayMap1 = function (array, func) {
  let isAsync = false
  const output = array.map(function arrayMapper(item) {
    const outputItem = func(item)
    if (isPromise(outputItem)) isAsync = true
    return item
  })
  return isAsync ? promiseAll(output) : output
}

const arrayMap2 = function (array, func) {
  const arrayLength = array.length, output = []
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const outputItem = func(array[index])
    if (isPromise(outputItem)) isAsync = true
    output[index] = outputItem
  }
  return isAsync ? promiseAll(output) : output
}

const arrayMap20 = function (array, func) {
  const arrayLength = array.length, output = []
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const outputItem = func(array[index])
    if (isPromise(outputItem)) isAsync = true
    output.push(outputItem)
  }
  return isAsync ? promiseAll(output) : output
}

const arrayMap3 = function (array, func) {
  const arrayLength = array.length,
    output = Array(arrayLength)
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const outputItem = func(array[index])
    if (isPromise(outputItem)) isAsync = true
    output[index] = outputItem
  }
  return isAsync ? promiseAll(output) : output
}

/**
 * @name arrayMap
 *
 * @benchmark
 * vanilla1: 1e+6: 44.19ms
 * arrayMap1: 1e+6: 46.194ms
 * arrayMap2: 1e+6: 65.156ms
 * arrayMap20: 1e+6: 62.963ms
 * arrayMap3: 1e+6: 29.981ms
 *
 * arrayMap1_forOf: 1e+6: 19.514ms
 * arrayMap2_forOf: 1e+6: 19.406ms
 * arrayMap3_forOf: 1e+6: 20.483ms
 *
 * arrayMap1_forLoop: 1e+6: 9.992ms
 * arrayMap2_forLoop: 1e+6: 9.958ms
 * arrayMap3_forLoop: 1e+6: 9.929ms
 *
 * RMap: 1e+6: 217.641ms
 * _Map: 1e+6: 32.702ms
 *
 * @NOTE Bo5
 *
 * @NOTE https://reinteractive.net/posts/292-the-quirky-array-constructor-and-a-use-for-holey-arrays-in-es6
 *
 * @NOTE https://v8.dev/blog/elements-kinds#avoid-creating-holes
 */

{
  const array = [1, 2, 3, 4, 5]

  const identity = value => value

  const array1 = arrayMap1(array, identity)

  const array2 = arrayMap2(array, identity)

  const array3 = arrayMap3(array, identity)

  const vanilla1 = (arr, func) => arr.map(func)

  const RMap = R.map

  const _Map = _.map

  // timeInLoop('vanilla1', 1e6, () => vanilla1(array, identity))

  // timeInLoop('arrayMap1', 1e6, () => arrayMap1(array, identity))

  // timeInLoop('arrayMap2', 1e6, () => arrayMap2(array, identity))

  // timeInLoop('arrayMap20', 1e6, () => arrayMap20(array, identity))

  // timeInLoop('arrayMap3', 1e6, () => arrayMap3(array, identity))

  // timeInLoop('arrayMap4', 1e6, () => arrayMap4(array, identity))

  // timeInLoop('arrayMap1_forOf', 1e6, () => { for (const item of array1) identity(item) })

  // timeInLoop('arrayMap2_forOf', 1e6, () => { for (const item of array2) identity(item) })

  // timeInLoop('arrayMap3_forOf', 1e6, () => { for (const item of array3) identity(item) })

  // timeInLoop('arrayMap1_forLoop', 1e6, () => { for (let i = 0; i < array1.length; i++) identity(array1[i]) })

  // timeInLoop('arrayMap2_forLoop', 1e6, () => { for (let i = 0; i < array2.length; i++) identity(array2[i]) })

  // timeInLoop('arrayMap3_forLoop', 1e6, () => { for (let i = 0; i < array3.length; i++) identity(array3[i]) })

  // timeInLoop('RMap', 1e6, () => RMap(array, identity))

  // timeInLoop('_Map', 1e6, () => _Map(array, identity))
}

const promiseAll1 = Promise.all.bind(Promise)

const promiseAll2 = array => new Promise(function (resolve) {
  const arrayLength = array.length,
    output = Array(arrayLength)
  let index = -1,
    numPromises = 0
  while (++index < arrayLength) {
    const value = array[index]
    if (isPromise(value)) {
      numPromises += 1
      value.then((index => function(res) {
        output[index] = res
        numPromises -= 1
        if (numPromises == 0) resolve(output)
      })(index))
    } else {
      output[index] = value
    }
  }
  if (numPromises == 0) resolve(object)
})

{
  /**
   * @name promiseAll
   *
   * @benchmark
   * promiseAll1: promiseArray: 1e+5: 89.714ms
   * promiseAll2: promiseArray: 1e+5: 92.055ms
   */

  const normalArray = [1, 2, 3, 4, 5]

  const promiseArray = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
    Promise.resolve(4),
    Promise.resolve(5),
  ]

  // promiseAll1(promiseArray).then(res => console.log('promiseAll1', res))
  // promiseAll2(promiseArray).then(res => console.log('promiseAll2', res))

  // timeInLoop.async('promiseAll1: promiseArray', 1e5, () => promiseAll1(promiseArray))

  // timeInLoop.async('promiseAll2: promiseArray', 1e5, () => promiseAll2(promiseArray))
}

const promiseObjectAll1 = object => new Promise(function (resolve) {
  const output = {}, promises = new Map()
  for (const key in object) {
    const value = object[key]
    if (isPromise(value)) {
      const promise = value.then((key => function (res) {
        output[key] = res
        promises.delete(key)
        if (promises.size == 0) resolve(output)
      })(key))
      promises.set(key, promise)
    } else {
      output[key] = value
    }
  }
  if (promises.size == 0) resolve(output)
})

const promiseObjectAll2 = object => new Promise(function (resolve) {
  const output = {}
  let numPromises = 0
  for (const key in object) {
    const value = object[key]
    if (isPromise(value)) {
      numPromises += 1
      value.then((key => function (res) {
        output[key] = res
        numPromises -= 1
        if (numPromises == 0) resolve(output)
      })(key))
    } else {
      output[key] = value
    }
  }
  if (numPromises == 0) resolve(output)
})

const promiseObjectAll3 = object => new Promise(function (resolve) {
  const output = {}, keys = objectKeys(object)
  let numPromises = 0
  for (const key of keys) {
    const value = object[key]
    if (isPromise(value)) {
      numPromises += 1
      value.then((key => function (res) {
        output[key] = res
        numPromises -= 1
        if (numPromises == 0) resolve(output)
      })(key))
    } else {
      output[key] = value
    }
  }
  if (numPromises == 0) resolve(output)
})

{
  /**
   * @name promiseObjectAll
   *
   * @benchmark
   * promiseObjectAll1: promiseObject: 1e+5: 189.951ms
   * promiseObjectAll2: promiseObject: 1e+5: 102.514ms
   * promiseObjectAll3: promiseObject: 1e+5: 110.166ms
   * promiseObjectAll1: normalObject: 1e+5: 68.371ms
   * promiseObjectAll2: normalObject: 1e+5: 59.979ms
   * promiseObjectAll3: normalObject: 1e+5: 66.123ms
   */

  const normalObject = { a: 1, b: 2, c: 3, d: 4, e: 5 }

  const promiseObject = {
    a: Promise.resolve(1),
    b: Promise.resolve(2),
    c: Promise.resolve(3),
    d: Promise.resolve(4),
    e: Promise.resolve(5),
  }

  // promiseObjectAll1(normalObject).then(res => console.log('normal', res))
  // promiseObjectAll1(promiseObject).then(res => console.log('promise', res))
  // promiseObjectAll2(normalObject).then(res => console.log('normal', res))
  // promiseObjectAll2(promiseObject).then(res => console.log('promise', res))
  // promiseObjectAll3(normalObject).then(res => console.log('normal', res))
  // promiseObjectAll3(promiseObject).then(res => console.log('promise', res))

  // timeInLoop.async('promiseObjectAll1: promiseObject', 1e5, () => promiseObjectAll1(promiseObject))

  // timeInLoop.async('promiseObjectAll2: promiseObject', 1e5, () => promiseObjectAll2(promiseObject))

  // timeInLoop.async('promiseObjectAll3: promiseObject', 1e5, () => promiseObjectAll3(promiseObject))

  // timeInLoop.async('promiseObjectAll1: normalObject', 1e5, () => promiseObjectAll1(normalObject))

  // timeInLoop.async('promiseObjectAll2: normalObject', 1e5, () => promiseObjectAll2(normalObject))

  // timeInLoop.async('promiseObjectAll3: normalObject', 1e5, () => promiseObjectAll3(normalObject))
}

const objectMap1 = function (object, mapperFunc) {
  const output = {}, promises = []
  for (const key in object) {
    const outputItem = mapperFunc(object[key])
    if (isPromise(outputItem)) {
      promises.push(outputItem.then(res => (output[key] = res)))
    } else {
      output[key] = outputItem
    }
  }
  return promises.length > 0 ? promiseAll(promises).then(() => output) : output
}

const promiseObjectAll = promiseObjectAll2

const objectMap2 = function (object, mapperFunc) {
  const output = {}
  let isAsync = false
  for (const key in object) {
    const outputItem = mapperFunc(object[key])
    if (isPromise(outputItem)) isAsync = true
    output[key] = outputItem
  }
  return isAsync ? promiseObjectAll(output) : output
}

const objectMap3 = function (object, mapperFunc) {
  const output = {}
  let isAsync = false
  for (const key of objectKeys(object)) {
    const outputItem = mapperFunc(object[key])
    if (isPromise(outputItem)) isAsync = true
    output[key] = outputItem
  }
  return isAsync ? promiseObjectAll(output) : output
}

/**
 * @name objectMap
 *
 * @benchmark
 * objectMap1: 1e+6: 286.133ms
 * objectMap2: 1e+6: 184.431ms
 * objectMap3: 1e+6: 273.79ms
 *
 * @remarks
 * The stark differential between objectMap1 and objectMap2 is surprising. In neither case are the asynchronous blocks hit. Perhaps it's the additional scope introduced from the .then handler of objectMap1.
 */

{
  const identity = value => value

  const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }

  // console.log(objectMap1(object, identity))
  // console.log(objectMap2(object, identity))
  // console.log(objectMap3(object, identity))

  // timeInLoop('objectMap1', 1e6, () => objectMap1(object, identity))

  // timeInLoop('objectMap2', 1e6, () => objectMap2(object, identity))

  // timeInLoop('objectMap3', 1e6, () => objectMap3(object, identity))
}

const generatorFunctionMap1 = function (generatorFunc, func) {
  return function* mappingGeneratorFunc(...args) {
    for (const item of generatorFunc(...args)) {
      yield func(item)
    }
  }
}

const generatorFunctionMap10 = function (generatorFunc, func) {
  return function* mappingGeneratorFunc() {
    for (const item of generatorFunc.apply(null, arguments)) {
      yield func(item)
    }
  }
}

const generatorFunctionMap11 = function (generatorFunc, func) {
  return function* mappingGeneratorFunc(...args) {
    for (const item of generatorFunc.apply(null, args)) {
      yield func(item)
    }
  }
}

const generatorFunctionMap12 = function (generatorFunc, func) {
  return function* mappingGeneratorFunc(...args) {
    for (const item of generatorFunc.call(null, ...args)) {
      yield func(item)
    }
  }
}

/**
 * @name generatorFunctionMap
 *
 * @benchmark
 * [...squareNumbers1()]: 1e+5: 120.221ms
 * [...squareNumbers10()]: 1e+5: 120.26ms
 * [...squareNumbers11()]: 1e+5: 120.734ms
 * [...squareNumbers12()]: 1e+5: 122.146ms
 */

{
  const numbers = function* () {
    yield 1; yield 2; yield 3; yield 4; yield 5
  }

  const square = number => number ** 2

  const squareNumbers1 = generatorFunctionMap1(numbers, square)
  const squareNumbers10 = generatorFunctionMap10(numbers, square)
  const squareNumbers11 = generatorFunctionMap11(numbers, square)
  const squareNumbers12 = generatorFunctionMap12(numbers, square)

  // timeInLoop('[...squareNumbers1()]', 1e5, () => [...squareNumbers1()])

  // timeInLoop('[...squareNumbers10()]', 1e5, () => [...squareNumbers10()])

  // timeInLoop('[...squareNumbers11()]', 1e5, () => [...squareNumbers11()])

  // timeInLoop('[...squareNumbers12()]', 1e5, () => [...squareNumbers12()])
}

const iteratorMap1 = function* (iter, func) {
  for (const item of iter) {
    yield func(item)
  }
}

const iteratorMap2 = function (iter, func) {
  const iterNext = iter.next.bind(iter)
  const mappingIter = {
    [symbolIterator]() {
      return mappingIter
    },
    next() {
      const { value, done } = iterNext()
      return done ? { value, done } : { value: func(value), done }
    },
  }
  return mappingIter
}

const iteratorMap21 = function (iter, func) {
  const mappingIter = {
    [symbolIterator]() {
      return mappingIter
    },
    next() {
      const { value, done } = iter.next()
      return done ? { value, done } : { value: func(value), done }
    },
  }
  return mappingIter
}

const iteratorMap3 = function (iter, func) {
  const iterNext = iter.next.bind(iter)
  const mappingIter = {
    [symbolIterator]: () => mappingIter,
    next: function () {
      const { value, done } = iterNext()
      return done ? { value, done } : { value: func(value), done }
    },
  }
  return mappingIter
}

const iteratorMap31 = function (iter, func) {
  const mappingIter = {
    [symbolIterator]: () => mappingIter,
    next: function () {
      const { value, done } = iter.next()
      return done ? { value, done } : { value: func(value), done }
    },
  }
  return mappingIter
}

const MappingIterator = function (iter, mappingFunc) {
  this.iter = iter
  this.mappingFunc = mappingFunc
}

MappingIterator.prototype[symbolIterator] = function mappingValues() {
  return this
}

MappingIterator.prototype.next = function next() {
  const { value, done } = this.iter.next()
  return done ? { value, done } : { value: this.mappingFunc(value), done }
}

const iteratorMap5 = (iter, func) => new MappingIterator1(iter, func)

/**
 * @name iteratorMap
 *
 * @benchmark
 * iteratorMap1: 1e+5: 111.57ms
 * iteratorMap2: 1e+5: 105.097ms
 * iteratorMap21: 1e+5: 99.13ms
 * iteratorMap3: 1e+5: 103.8ms
 * iteratorMap31: 1e+5: 98.715ms
 * iteratorMap5: 1e+5: 89.505ms
 */

{
  const square = number => number ** 2

  const numbers = function* () {
    yield 1; yield 2; yield 3; yield 4; yield 5
  }

  // console.log([...numbers()])
  // console.log([...iteratorMap1(numbers(), square)])
  // console.log([...iteratorMap2(numbers(), square)])
  // console.log([...iteratorMap21(numbers(), square)])
  // console.log([...iteratorMap5(numbers(), square)])

  // timeInLoop('iteratorMap1', 1e5, () => [...iteratorMap1(numbers(), square)])

  // timeInLoop('iteratorMap2', 1e5, () => [...iteratorMap2(numbers(), square)])

  // timeInLoop('iteratorMap21', 1e5, () => [...iteratorMap21(numbers(), square)])

  // timeInLoop('iteratorMap3', 1e5, () => [...iteratorMap3(numbers(), square)])

  // timeInLoop('iteratorMap31', 1e5, () => [...iteratorMap31(numbers(), square)])

  // timeInLoop('iteratorMap5', 1e5, () => [...iteratorMap5(numbers(), square)])
}

const asyncGeneratorFunctionMap1 = function (asyncGeneratorFunc, func) {
  return async function* mappingAsyncGeneratorFunc(...args) {
    for await (const item of asyncGeneratorFunc(...args)) {
      yield func(item)
    }
  }
}

/**
 * @name asyncGeneratorFunctionMap
 *
 * @benchmark
 * asyncGeneratorFunctionMap1: 1e+5: 431.501ms
 */

{
  const asyncNumbers = async function*() {
    for (let i = 1; i <= 5; i++) yield i
  }

  const square = number => number ** 2

  const squares = asyncGeneratorFunctionMap1(asyncNumbers, square)

  // asyncIteratorToArray(squares()).then(console.log)

  // timeInLoop.async('asyncGeneratorFunctionMap1', 1e5, () => asyncIteratorToArray(squares()))
}

const asyncIteratorMap1 = async function* (asyncIter, func) {
  for await (const item of asyncIter) {
    yield func(item)
  }
}

const asyncIteratorMap2 = (asyncIter, func) => ({
  [symbolAsyncIterator]() {
    const asyncIterNext = asyncIter.next.bind(asyncIter)
    return {
      async next() {
        const { value, done } = await asyncIterNext()
        return done ? { value, done } : { value: await func(value), done }
      }
    }
  }
})

const MappingAsyncIterator = function (asyncIter, mappingFunc) {
  this.asyncIter = asyncIter
  this.mappingFunc = mappingFunc
}

MappingAsyncIterator.prototype[symbolAsyncIterator] = function mappingValues() {
  return this
}

MappingAsyncIterator.prototype.next = async function next() {
  const { value, done } = await this.asyncIter.next()
  return done ? { value, done } : { value: await this.mappingFunc(value), done }
}

const asyncIteratorMap3 = (asyncIter, mappingFunc) => new MappingAsyncIterator(asyncIter, mappingFunc)

const MappingAsyncIterator2 = function (asyncIter, mappingFunc) {
  this.asyncIter = asyncIter
  this.mappingFunc = mappingFunc
}

MappingAsyncIterator2.prototype[symbolAsyncIterator] = function mappingValues() {
  return this
}

MappingAsyncIterator2.prototype.next = async function next() {
  const { value, done } = await this.asyncIter.next()
  if (done) return { value: undefined, done: true }
  const resultItem = this.mappingFunc(value)
  return isPromise(resultItem)
    ? resultItem.then(res => ({ value: res, done: false }))
    : ({ value: resultItem, done: false })
}

const asyncIteratorMap31 = (asyncIter, mappingFunc) => new MappingAsyncIterator2(asyncIter, mappingFunc)

/**
 * @name asyncIteratorMap
 *
 * @benchmark
 * asyncIteratorMap1: 1e+5: 411.392ms
 * asyncIteratorMap2: 1e+5: 422.184ms
 * asyncIteratorMap3: 1e+5: 385.01ms
 * asyncIteratorMap31: 1e+5: 332.436ms
 */

{
  const asyncNumbers = async function*() {
    for (let i = 1; i <= 5; i++) yield i
  }

  const square = number => number ** 2

  // timeInLoop.async('asyncIteratorMap1', 1e5, () => asyncIteratorToArray(asyncIteratorMap1(asyncNumbers(), square)))

  // timeInLoop.async('asyncIteratorMap2', 1e5, () => asyncIteratorToArray(asyncIteratorMap2(asyncNumbers(), square)))

  // timeInLoop.async('asyncIteratorMap3', 1e5, () => asyncIteratorToArray(asyncIteratorMap3(asyncNumbers(), square)))

  // timeInLoop.async('asyncIteratorMap31', 1e5, () => asyncIteratorToArray(asyncIteratorMap31(asyncNumbers(), square)))
}

const reducerMap1 = (reducer, func) => function mappingReducer(accum, value) {
  const resultItem = func(value)
  return isPromise(resultItem)
    ? resultItem.then(res => reducer(accum, res))
    : reducer(accum, resultItem)
}

const reducerMap10 = (reducer, func) => function mappingReducer(accum, value) {
  const resultItem = func.call(null, value)
  return isPromise(resultItem)
    ? resultItem.then(res => reducer.call(null, accum, res))
    : reducer(accum, resultItem)
}

/**
 * @name reducerMap
 *
 * @benchmark
 * reducerMap1: 1e+5: 162.672ms
 * reducerMap10: 1e+5: 176.32ms
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const square = number => number ** 2

  const arrayConcat = (arrA, arrB) => arrA.concat(arrB)

  // timeInLoop('reducerMap1', 1e5, () => numbers.reduce(reducerMap1(arrayConcat, square), []))

  // timeInLoop('reducerMap10', 1e5, () => numbers.reduce(reducerMap10(arrayConcat, square), []))
}

const possiblePromiseThen = (value, func) => (
  isPromise(value) ? value.then(func) : func(value))

/**
 * @name arrayMapSeries
 *
 * @benchmark
 * arrayMapSeries1: 1e+5: 173.068ms
 * arrayMapSeries2: 1e+5: 12.713ms
 */

const arrayMapSeries1 = (f, x, i, y) => {
  if (i === x.length) return y
  return possiblePromiseThen(
    f(x[i]),
    res => arrayMapSeries1(f, x, i + 1, y.concat(res)),
  )
}

const asyncArrayMapSeries = async function (array, func, result, index) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    result[index] = await func(array[index])
  }
  return result
}

const arrayMapSeries2 = function (array, func) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1
  while (++index < arrayLength) {
    const resultItem = func(array[index])
    if (isPromise(resultItem)) {
      return resultItem.then(res => {
        result[index] = res
        return asyncArrayMapSeries(array, func, result, index)
      })
    }
    result[index] = resultItem
  }
  return result
}

{
  const numbers = [1, 2, 3, 4, 5]

  const square = number => number ** 2

  // console.log(arrayMapSeries1(square, numbers, 0, []))
  // console.log(arrayMapSeries2(numbers, square))

  // timeInLoop('arrayMapSeries1', 1e5, () => arrayMapSeries1(square, numbers, 0, []))

  // timeInLoop('arrayMapSeries2', 1e5, () => arrayMapSeries2(numbers, square))
}

/**
 * @name arrayMapPool
 *
 * @benchmark
 * arrayMapPool1: 1e+5: 342.172ms
 * arrayMapPool2: 1e+5: 359.173ms
 */

const asyncArrayMapPool1 = async function (
  array, mappingFunc, size, result, index, promises,
) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    if (promises.size >= size) {
      await promiseRace(promises)
    }
    const resultItem = mappingFunc(array[index])
    if (isPromise(resultItem)) {
      const selfDeletingPromise = resultItem.then(res => {
        promises.delete(selfDeletingPromise)
        return res
      })
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
    } else {
      result[index] = resultItem
    }
  }
  return promiseAll(result)
}

const arrayMapPool1 = function (array, mappingFunc, size) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1
  while (++index < arrayLength) {
    const resultItem = mappingFunc(array[index])
    if (isPromise(resultItem)) {
      const promises = new Set()
      const selfDeletingPromise = resultItem.then(res => {
        promises.delete(selfDeletingPromise)
        return res
      })
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
      return asyncArrayMapPool1(
        array, mappingFunc, size, result, index, promises)
    }
    result[index] = resultItem
  }
  return result
}

const setProtoAdd = Set.prototype.add

const setProtoDelete = Set.prototype.delete

const setAdd = (set, item) => setProtoAdd.call(set, item)

const setDelete = (set, item) => setProtoDelete.call(set, item)

const asyncArrayMapPool2 = async function (
  array, mappingFunc, size, result, index, promises,
) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    if (promises.size >= size) {
      await promiseRace(promises)
    }
    const resultItem = mappingFunc(array[index])
    if (isPromise(resultItem)) {
      const selfDeletingPromise = resultItem.then(res => {
        setDelete(promises, selfDeletingPromise)
        return res
      })
      setAdd(promises, selfDeletingPromise)
      result[index] = selfDeletingPromise
    } else {
      result[index] = resultItem
    }
  }
  return promiseAll(result)
}

const arrayMapPool2 = function (array, mappingFunc, size) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1
  while (++index < arrayLength) {
    const resultItem = mappingFunc(array[index])
    if (isPromise(resultItem)) {
      const promises = new Set()
      const selfDeletingPromise = resultItem.then(res => {
        promises.delete(selfDeletingPromise)
        return res
      })
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
      return asyncArrayMapPool2(
        array, mappingFunc, size, result, index, promises)
    }
    result[index] = resultItem
  }
  return result
}

{
  const asyncSquare = async number => number ** 2

  const range = length => Array.from({ length }, (_, i) => i + 1)

  const promiseRange = length => Array.from({ length }, (_, i) => Promise.resolve(i))

  // arrayMapPool1(range(5), asyncSquare, 100).then(console.log)
  // arrayMapPool2(range(5), asyncSquare, 100).then(console.log)

  // timeInLoop.async('arrayMapPool1', 1e5, () => arrayMapPool1(range(5), asyncSquare, 100))
  // timeInLoop.async('arrayMapPool2', 1e5, () => arrayMapPool2(range(5), asyncSquare, 100))
}

/**
 * @name arrayMapWithIndex
 *
 * @benchmark
 * arrayMapWithIndex1: 1e+6: 29.659ms
 * arrayMapWithIndex2: 1e+6: 31.844ms
 */

const arrayMapWithIndex1 = function (array, func) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const resultItem = func(array[index], index, array)
    if (isPromise(resultItem)) isAsync = true
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

const arrayMapWithIndex2 = function (array, func) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const resultItem = func.call(null, array[index], index, array)
    if (isPromise(resultItem)) isAsync = true
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

{
  const array = [1, 2, 3, 4, 5]

  const identity = value => value

  // console.log(arrayMapWithIndex1(array, identity))

  // timeInLoop('arrayMapWithIndex1', 1e6, () => arrayMapWithIndex1(array, identity))

  // timeInLoop('arrayMapWithIndex2', 1e6, () => arrayMapWithIndex2(array, identity))
}
