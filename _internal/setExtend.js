/**
 * @name setExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * setExtend(set, values Set|any) -> set
 * ```
 *
 * @related arrayExtend
 */
const setExtend = function (set, values) {
  if (values != null && values.constructor == Set) {
    for (const value of values) {
      set.add(value)
    }
    return set
  }
  return set.add(values)
}

module.exports = setExtend
