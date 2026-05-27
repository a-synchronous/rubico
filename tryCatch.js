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
 * type Function = (...arguments)=>Promise|any
 * type Catcher = (error Error|any, ...arguments)=>Promise|any
 *
 * tryer Function
 * catcher Catcher
 *
 * tryCatch(tryer, catcher)(...arguments) -> Promise|any
 * tryCatch(...arguments, tryer, catcher) -> Promise|any
 * ```
 *
 * @description
 * Function error handler. Accepts a tryer function and a catcher function. Calls the tryer function and catches any error thrown by the tryer function with the catcher function.
 *
 * ```javascript [playground]
 * const throwsIfOdd = number => {
 *   if (number % 2 === 1) {
 *     throw new Error(`${number} is odd`)
 *   }
 *   console.log('did not throw for number', number)
 * }
 *
 * const errorHandler = (error, number) => {
 *   console.log('caught error from number', number)
 *   console.log(error)
 * }
 *
 * const handler = tryCatch(throwsIfOdd, errorHandler)
 *
 * handler(2)
 * handler(3)
 * ```
 *
 * If the tryer function is asynchronous and returns a rejected promise, the catcher function will handle the error from the rejected promise.
 *
 * ```javascript [playground]
 * const rejectsIfOdd = async number => {
 *   if (number % 2 == 1) {
 *     throw new Error(`${number} is odd`)
 *   }
 *   console.log('did not reject for number', number)
 * }
 *
 * const errorHandler = (error, number) => {
 *   console.log('caught error from number', number)
 *   console.log(error)
 * }
 *
 * const asyncHandler = tryCatch(rejectsIfOdd, errorHandler)
 *
 * asyncHandler(2)
 * asyncHandler(3)
 * ```
 *
 * `tryCatch` executes eagerly when provided any number of arguments before the tryer and catcher functions.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * tryCatch(1, 2, 3, function throwSum(...numbers) {
 *   const sum = numbers.reduce(add)
 *   throw new Error(`the sum is ${sum}`)
 * }, function logErrorMessage(error) {
 *   console.error(error.message)
 * })
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * tryCatch(Promise.resolve(1), 2, Promise.resolve(3), (a, b, c) => {
 *   const sum = a + b + c
 *   if (sum > 5) {
 *     throw new Error('limit exceeded')
 *   }
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
