const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const catcherApply = require('./_internal/catcherApply')

/**
 * @name tryCatch
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   tryer ...args=>Promise|any,
 *   catcher (error Error, ...args)=>Promise|any
 *
 * tryCatch(tryer, catcher)(...args) -> Promise|any
 * ```
 *
 * @description
 * Try a `tryer`, catch with `catcher`. On error or rejected promise, call the `catcher` with the error followed by any arguments to the tryer.
 *
 * ```javascript [playground]
 * const errorThrower = tryCatch(
 *   message => {
 *     throw new Error(message)
 *   },
 *   (error, message) => {
 *     console.log(error)
 *     return `${message} from catcher`
 *   },
 * )
 *
 * console.log(errorThrower('hello')) // Error: hello
 *                                    // hello from catcher
 * ```
 *
 * `tryCatch` behaves eagerly when passed any amount of arguments before the tryer and catcher.
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
    try {
      const result = tryer(...args)
      return isPromise(result)
        ? result.catch(curry3(catcherApply, catcher, __, args))
        : result
    } catch (error) {
      return catcher(error, ...args)
    }
  }

  const tryer = args[0],
    catcher = args[1]
  return function tryCatcher(...args) {
    try {
      const result = tryer(...args)
      return isPromise(result)
        ? result.catch(curry3(catcherApply, catcher, __, args))
        : result
    } catch (error) {
      return catcher(error, ...args)
    }
  }
}

module.exports = tryCatch
