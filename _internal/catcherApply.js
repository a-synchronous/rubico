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

module.exports = catcherApply
