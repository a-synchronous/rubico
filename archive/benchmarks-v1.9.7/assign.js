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

/**
 * @name curry2
 *
 * @synopsis
 * __ = Symbol('placeholder')
 *
 * curry2(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 * ) -> function
 */
const curry2 = function (baseFunc, arg0, arg1) {
  return arg0 == __
    ? curry2ResolveArg0(baseFunc, arg1)
    : curry2ResolveArg1(baseFunc, arg0)
}

// const objectAssign = Object.assign

const objectAssign = (objA, objB) => ({ ...objA, ...objB })

const assign5 = function (funcs) {
  const allFuncs = funcObjectAll3(funcs)
  return function assignment(object) {
    const result = allFuncs(object)
    return isPromise(result)
      ? result.then(curry2(objectAssign, object, __))
      : ({ ...object, ...result })
  }
}

/**
 * @name assign
 *
 * @benchmark
 * assign1: 1e+5: 67.168ms
 * assign2: 1e+5: 60.779ms
 * assign3: 1e+5: 58.094ms
 * assign5: 1e+5: 59.132ms
 *
 * @remarks
 * currying is slower here
 */

{

  // console.log('assign1', assign1(funcs)({ number: 2 }))
  // console.log('assign2', assign2(funcs)({ number: 2 }))
  // console.log('assign3', assign3(funcs)({ number: 2 }))
  // console.log('assign5', assign5(funcs)({ number: 2 }))

  // timeInLoop('assign1', 1e5, () => assign1(funcs)({ number: 2 }))

  // timeInLoop('assign2', 1e5, () => assign2(funcs)({ number: 2 }))

  // timeInLoop('assign3', 1e5, () => assign3(funcs)({ number: 2 }))

  // timeInLoop('assign5', 1e5, () => assign5(funcs)({ number: 2 }))
}
