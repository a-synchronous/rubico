const timeInLoop = require('../x/timeInLoop')
const { assign } = require('..')

const isPromise = value => value != null && typeof value.then == 'function'

const promiseAll = Promise.all.bind(Promise)

const funcObjectAll1 = funcs => function objectAllFuncs(...args) {
  const output = {}, promises = []
  for (const key in funcs) {
    const outputItem = funcs[key].apply(null, args)
    if (isPromise(outputItem)) {
      promises.push(outputItem.then(res => {
        output[key] = res
      }))
    } else {
      output[key] = outputItem
    }
  }
  return promises.length == 0 ? output : promiseAll(promises).then(() => output)
}

const funcObjectAll2 = funcs => function objectAllFuncs(...args) {
  const output = {}, promises = []
  for (const key in funcs) {
    const outputItem = funcs[key](...args)
    if (isPromise(outputItem)) {
      promises.push(outputItem.then(res => {
        output[key] = res
      }))
    } else {
      output[key] = outputItem
    }
  }
  return promises.length == 0 ? output : promiseAll(promises).then(() => output)
}

const funcObjectAll3 = funcs => function objectAllFuncs(...args) {
  const result = {}
  let isAsync = false
  for (const key in funcs) {
    const resultItem = funcs[key](...args)
    if (isPromise(resultItem)) isAsync = true
    result[key] = resultItem
  }
  return isAsync ? promiseObjectAll(result) : result
}


const vanilla1 = ({ number }) => ({
  number,
  a: number + 1,
  b: number + 2,
  c: number + 3,
})

const funcs = {
  a: ({ number }) => number + 1,
  b: ({ number }) => number + 2,
  c: ({ number }) => number + 3,
}

const vanilla2 = function (obj) {
  const output = { ...obj }
  for (const key in funcs) {
    output[key] = funcs[key](obj)
  }
  return output
}

const assign1 = function (funcs) {
  const allFuncs = funcObjectAll1.call(null, funcs)
  return function assignment(input) {
    const output = allFuncs.call(null, input)
    return isPromise(output)
      ? output.then(res => ({ ...input, ...res }))
      : ({ ...input, ...output })
  }
}

const assign2 = function (funcs) {
  const allFuncs = funcObjectAll2(funcs)
  return function assignment(input) {
    const output = allFuncs(input)
    return isPromise(output)
      ? output.then(res => ({ ...input, ...res }))
      : ({ ...input, ...output })
  }
}

const assign3 = function (funcs) {
  const allFuncs = funcObjectAll3(funcs)
  return function assignment(input) {
    const output = allFuncs(input)
    return isPromise(output)
      ? output.then(res => ({ ...input, ...res }))
      : ({ ...input, ...output })
  }
}

/**
 * @name assign
 *
 * @benchmark
 * assign1: 1e+5: 66.807ms
 * assign2: 1e+5: 59.898ms
 * assign3: 1e+5: 57.537ms
 */

{

  // console.log('assign1', assign1(funcs)({ number: 2 }))
  // console.log('assign2', assign2(funcs)({ number: 2 }))
  // console.log('assign3', assign3(funcs)({ number: 2 }))

  // timeInLoop('assign1', 1e5, () => assign1(funcs)({ number: 2 }))

  // timeInLoop('assign2', 1e5, () => assign2(funcs)({ number: 2 }))

  // timeInLoop('assign3', 1e5, () => assign3(funcs)({ number: 2 }))
}
