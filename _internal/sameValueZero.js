/**
 * @name sameValueZero
 *
 * @synopsis
 * ```coffeescript [specscript]
 * sameValueZero(left any, right any) -> boolean
 * ```
 *
 * @description
 * Determine if two values are the same value. [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero).
 */
const sameValueZero = function (left, right) {
  return left === right || (left !== left && right !== right)
}

module.exports = sameValueZero
