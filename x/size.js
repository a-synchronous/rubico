'use strict'

// object => numKeys number
const objectKeysCount = object => {
  let numKeys = 0
  for (const _ in object) {
    numKeys += 1
  }
  return numKeys
}

/**
 * @name size
 *
 * @synopsis
 * ```coffeescript [specscript]
 * size(value any) -> number
 * ```
 *
 * @description
 * Get the count of items in a value.
 *
 * ```javascript [playground]
 * console.log(
 *   size([1, 2, 3]),
 * ) // 3
 * ```
 */
const size = value => typeof value == 'string' ? value.length
  : value == null ? 0
  : typeof value.length == 'number' ? value.length
  : typeof value.size == 'number' ? value.size
  : value.constructor == Object ? objectKeysCount(value)
  : 1

module.exports = size
