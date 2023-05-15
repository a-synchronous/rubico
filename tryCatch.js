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
 * tryCatch(tryer function, catcher function)(...args) -> Promise|any
 *
 * tryCatch(...args, tryer function, catcher function) -> Promise|any
 * ```
 *
 * @description
 * Handles errors with a `tryer` and a `catcher` function. Calls the `tryer` function with the provided arguments and catches any errors thrown by the `tryer` function with the `catcher` function. If the `tryer` function is asynchronous and returns a rejected promise, the `catcher` function will execute with the value of the rejected promise. The `catcher` function is called with the error and all arguments supplied to the `tryer` function.
 *
 * ```javascript [playground]
 * const throwsIfOdd = number => {
 *   if (number % 2 == 1) {
 *     throw new Error(`${number} is odd`)
 *   }
 *   console.log('did not throw for', number)
 * }
 *
 * const errorHandler = tryCatch(throwsIfOdd, (error, number) => {
 *   console.log('caught error from number', number)
 *   console.log(error)
 * })
 *
 * errorHandler(2) // did not throw for 2
 * errorHandler(3) // caught error from number 3
 *                 // Error: 3 is odd
 *
 * ```
 *
 * `tryCatch` behaves eagerly (executes immediately with a single call and not with multiple calls like a higher order function) when passed any amount of nonfunction (primitive or object) arguments before the `tryer` and `catcher` functions.
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
