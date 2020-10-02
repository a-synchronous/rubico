/**
 * @name last
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value Array|string
 *
 * last(value) -> any
 * ```
 *
 * @description
 * Get the last item of a collection
 *
 * ```javascript [node]
 * const last = require('rubico/x/last')
 *
 * console.log(last([1, 2, 3])) // 3
 * console.log(last([])) // undefined
 * ```
 */
const last = value => {
  if (value == null) {
    return undefined
  }
  const length = value.length
  return typeof length == 'number' ? value[length - 1] : undefined
}

module.exports = last
