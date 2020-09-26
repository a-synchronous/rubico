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
 * size(value String|Array|Object|Set|Map) -> number
 *
 * @catchphrase
 * Get the size of a collection
 *
 * @description
 * `size` accepts a String, Array, Object, Set, or Map and returns its current size in items as a number.
 *
 * @example
 * console.log(
 *   size([1, 2, 3]),
 * ) // 3
 */
const size = value => typeof value == 'string' ? value.length
  : typeof value == null ? 0
  : 'length' in value ? value.length
  : 'size' in value ? value.size
  : value.constructor == Object ? objectKeysCount(value)
  : 1

module.exports = size
