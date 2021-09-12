/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const objectKeysLength = object => {
  let numKeys = 0
  for (const _ in object) {
    numKeys += 1
  }
  return numKeys
}

const size = value => typeof value == 'string' ? value.length
  : value == null ? 0
  : typeof value.length == 'number' ? value.length
  : typeof value.size == 'number' ? value.size
  : value.constructor == Object ? objectKeysLength(value)
  : 1

export default size
