/**
 * @name async
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   result any,
 *   func ...args=>result
 *
 * async(func) -> ...args=>Promise<result>
 * ```
 *
 * @description
 * Make a function always return a promise.
 */
const async = func => async function asyncFunc(...args) {
  return func(...args)
}

module.exports = async
