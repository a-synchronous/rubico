/**
 * @name objectKeysLength
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectKeysLength(object Object) -> number
 * ```
 */
const objectKeysLength = object => {
  let numKeys = 0
  for (const _ in object) {
    numKeys += 1
  }
  return numKeys
}

module.exports = objectKeysLength
