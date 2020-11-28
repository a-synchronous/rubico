/**
 * @name isArrayLike
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isArrayLike(value any) -> boolean
 * ```
 *
 * @description
 * Tell if a value has positive `length` like an Array.
 */
const isArrayLike = function (value) {
  return value != null && value.length > 0
}

module.exports = isArrayLike
