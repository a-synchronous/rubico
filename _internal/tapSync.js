/**
 * @name tapSync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * tapSync<
 *   tapper function,
 *   args ...any,
 * >(tapper)(...args) -> args[0]
 * ```
 *
 * @description
 * Call a function with arguments, returning the first argument. Promises are not handled.
 */
const tapSync = func => function tapping(...args) {
  func(...args)
  return args[0]
}

module.exports = tapSync
