const { tryCatch } = require('..')
const { timeInLoop } = require('../x')

const isPromise = value => value != null && typeof value.then == 'function'

const tryCatch2 = (tryer, catcher) => function tryCatcher(...args) {
  try {
    const output = tryer.apply(null, args)
    return isPromise(output)
      ? output.catch(err => catcher.call(null, err, ...args))
      : output
  } catch (err) {
    return catcher.call(null, err, ...args)
  }
}

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

/**
 * @name curry3
 *
 * @synopsis
 * __ = Symbol('placeholder')
 *
 * curry3(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any
 * ) -> function
 */
const curry3 = function (baseFunc, arg0, arg1, arg2) {
  if (arg0 == __) {
    return curry3ResolveArg0(baseFunc, arg1, arg2)
  }
  if (arg1 == __) {
    return curry3ResolveArg1(baseFunc, arg0, arg2)
  }
  return curry3ResolveArg2(baseFunc, arg0, arg1)
}

const tryCatch3 = (tryer, catcher) => function tryCatcher(...args) {
  try {
    const result = tryer(...args)
    return isPromise(result)
      ? result.catch(curry3(catcherApply, catcher, __, args))
      : result
  } catch (err) {
    return catcher(err, ...args)
  }
}

/**
 * @name tryCatch
 *
 * @benchmark
 * tryCatch2: 1e+6: 36.369ms
 * tryCatch3: 1e+6: 17.027ms
 */

{
  const identity = value => value

  const noop = () => {}

  const isPromise = value => value != null && typeof value.then == 'function'

  // console.log(tryCatch2(identity, noop)('yo'))
  // console.log(tryCatch3(identity, noop)('yo'))

  // timeInLoop('tryCatch2', 1e6, () => tryCatch2(identity, noop)('yo'))

  // timeInLoop('tryCatch3', 1e6, () => tryCatch3(identity, noop)('yo'))
}
