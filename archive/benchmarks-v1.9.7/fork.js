const timeInLoop = require('../x/timeInLoop')
const { fork } = require('..')

const isPromise = value => value != null && typeof value.then == 'function'

/**
 * @name promiseObjectAll
 *
 * @synopsis
 * promiseObjectAll(object<Promise|any>) -> Promise<object>
 */
const promiseObjectAll = object => new Promise(function (resolve) {
  const result = {}
  let numPromises = 0
  for (const key in object) {
    const value = object[key]
    if (isPromise(value)) {
      numPromises += 1
      value.then((key => function (res) {
        result[key] = res
        numPromises -= 1
        if (numPromises == 0) resolve(result)
      })(key))
    } else {
      result[key] = value
    }
  }
  if (numPromises == 0) resolve(result)
})

/**
 * @name arrayFork
 *
 * @benchmark
 * arrayFork1: 1e+5: 26.814ms
 * arrayFork2: 1e+5: 19.675ms
 */

const funcAll1 = funcs => function allFuncs(...args) {
  let isAsync = false
  const result = funcs.map(func => {
    const resultItem = func.apply(null, args)
    if (isPromise(resultItem)) isAsync = true
    return resultItem
  })
  return isAsync ? promiseAll(result) : result
}

const funcAll2 = funcs => function allFuncs(...args) {
  const funcsLength = funcs.length,
    result = Array(funcsLength)
  let funcsIndex = -1, isAsync = false
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) isAsync = true
    result[funcsIndex] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

{
  const funcs = [
    number => number + 1,
    number => number + 2,
    number => number + 3,
  ]

  // console.log(funcAll2(funcs)(2))

  // timeInLoop('arrayFork1', 1e5, () => funcAll1(funcs)(2))

  timeInLoop('arrayFork2', 1e5, () => funcAll2(funcs)(2))
}

/**
 * @name objectFork
 *
 * @benchmark
 * objectFork1: 1e+5: 38.942ms
 * objectFork2: 1e+5: 34.967ms
 */

const funcObjectAll1 = funcs => function objectAllFuncs(...args) {
  const result = {}, promises = []
  for (const key in funcs) {
    const resultItem = funcs[key].apply(null, args)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(res => {
        result[key] = res
      }))
    } else {
      result[key] = resultItem
    }
  }
  return promises.length == 0 ? result : promiseAll(promises).then(() => result)
}

const funcObjectAll2 = funcs => function objectAllFuncs(...args) {
  const result = {}
  let isAsync = false
  for (const key in funcs) {
    const resultItem = funcs[key](...args)
    if (isPromise(resultItem)) isAsync = true
    result[key] = resultItem
  }
  return isAsync ? promiseObjectAll(result) : result
}

{
  const funcs = {
    a: number => number + 1,
    b: number => number + 2,
    c: number => number + 3,
  }

  const arrayFork1 = funcObjectAll1(funcs)

  const arrayFork2 = funcObjectAll2(funcs)

  // timeInLoop('objectFork1', 1e5, () => funcObjectAll1(funcs)(2))

  // timeInLoop('objectFork2', 1e5, () => funcObjectAll2(funcs)(2))
}
