const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const catcherApply = require('./_internal/catcherApply')
const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')

// _tryCatch(tryer function, catcher function, args Array) -> Promise
const _tryCatch = function (tryer, catcher, args) {
  try {
    const result = tryer(...args)
    return isPromise(result)
      ? result.catch(curry3(catcherApply, catcher, __, args))
      : result
  } catch (error) {
    return catcher(error, ...args)
  }
}

/**
 * @name tryCatch
 *
 * @synopsis
 * ```coffeescript [specscript]
 * args Array<any>
 * argsOrPromises Array<Promise|any>
 *
 * type SyncOrAsyncFunction = (...args)=>Promise|any
 * type SyncOrAsyncCatcher = (error Error|any, ...args)=>Promise|any
 *
 * tryer SyncOrAsyncFunction
 * catcher SyncOrAsyncCatcher
 *
 * tryCatch(tryer, catcher)(...args) -> Promise|any
 * tryCatch(...argsOrPromises, tryer, catcher) -> Promise|any
 * ```
 *
 * @description
 * Function equivalent to the [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) statement. Accepts two functions: a `tryer` function and a `catcher` function. Calls the `tryer` function and catches any errors thrown by the `tryer` function with the `catcher` function.
 *
 * ```javascript [playground]
 * const throwsIfOdd = number => {
 *   if (number % 2 == 1) {
 *     throw new Error(`${number} is odd`)
 *   }
 *   console.log('did not throw for', number)
 * }
 *
 * const errorHandler = (error, number) => {
 *   console.log('caught error from number', number)
 *   console.log(error)
 * }
 *
 * const handler = tryCatch(throwsIfOdd, errorHandler)
 *
 * handler(2) // did not throw for 2
 * handler(3) // caught error from number 3
 *            // Error: 3 is odd
 *
 * ```
 *
 * If the `tryer` function is asynchronous and throws an error, the `catcher` function will catch the rejected promise.
 *
 * ```javascript [playground]
 * const rejectsIfOdd = async number => {
 *   if (number % 2 == 1) {
 *     throw new Error(`${number} is odd`)
 *   }
 *   console.log('did not throw for', number)
 * }
 *
 * const errorHandler = (error, number) => {
 *   console.log('caught error from number', number)
 *   console.log(error)
 * }
 *
 * const asyncHandler = tryCatch(rejectsIfOdd, errorHandler)
 *
 * asyncHandler(2) // did not throw for 2
 * asyncHandler(3) // caught error from number 3
 *                 // Error: 3 is odd
 *
 * ```
 *
 * When provided any number of arguments before the tryer and catcher functions, `tryCatch` executes immediately.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * tryCatch(1, 2, 3, function throwSum(...numbers) {
 *   const sum = numbers.reduce(add)
 *   throw new Error(`the sum is ${sum}`)
 * }, function logErrorMessage(error) {
 *   console.error(error.message) // the sum is 6
 * })
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * tryCatch(Promise.resolve(1), 2, Promise.resolve(3), (a, b, c) => {
 *   const sum = a + b + c
 *   if (sum > 5) {
 *     throw new Error('limit exceeded')
 *   }
 *   console.log('sum:', sum)
 * }, (error, a, b, c) => {
 *   console.error(`${a} + ${b} + ${c}: ${error.message}`)
 * })
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [switchCase](/docs/switchCase)
 *  * [all](/docs/all)
 */

const tryCatch = function (...args) {
  if (args.length > 2) {
    const catcher = args.pop(),
      tryer = args.pop()
    if (areAnyValuesPromises(args)) {
      return promiseAll(args)
        .then(curry3(_tryCatch, tryer, catcher, __))
    }
    return _tryCatch(tryer, catcher, args)
  }

  const tryer = args[0],
    catcher = args[1]
  return function tryCatcher(...args) {
    return _tryCatch(tryer, catcher, args)
  }
}

module.exports = tryCatch
