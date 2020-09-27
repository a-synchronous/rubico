const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')

/**
 * @name catcherApply
 *
 * @synopsis
 * ```coffeescript [specscript]
 * catcherApply<
 *   args ...any,
 *   err Error|any,
 *   catcher (err, ...args)=>any,
 * >(catcher, err, args) -> catcher(err, ...args)
 * ```
 *
 * @description
 * Apply an error and arguments to a catcher.
 */
const catcherApply = function (catcher, err, args) {
  return catcher(err, ...args)
}

/**
 * @name tryCatch
 *
 * @synopsis
 * ```coffeescript [specscript]
 * tryCatch<args ...any>(
 *   tryer ...args=>Promise|any,
 *   catcher (err Error|any, ...args)=>Promise|any,
 * )(...args) -> result Promise|any
 * ```
 *
 * @description
 * Try a tryer, catch with catcher. On error or rejected Promise, call the catcher with the error followed by any arguments to the tryer.
 *
 * ```javascript [playground]
 * const errorThrower = tryCatch(
 *   message => {
 *     throw new Error(message)
 *   },
 *   (err, message) => {
 *     console.log(err)
 *     return `${message} from catcher`
 *   },
 * )
 *
 * console.log(errorThrower('hello')) // Error: hello
 *                                    // hello from catcher
 * ```
 */
const tryCatch = (tryer, catcher) => function tryCatcher(...args) {
  try {
    const result = tryer(...args)
    return isPromise(result)
      ? result.catch(curry3(catcherApply, catcher, __, args))
      : result
  } catch (err) {
    return catcher(err, ...args)
  }
}

module.exports = tryCatch
