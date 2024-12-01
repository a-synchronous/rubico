/**
 * @name setAdd
 *
 * @synopsis
 * ```coffeescript [specscript]
 * setAdd(set Set, value any) -> set
 * ```
 */
const setAdd = function (set, value) {
  set.add(value)
  return set
}

module.exports = setAdd
