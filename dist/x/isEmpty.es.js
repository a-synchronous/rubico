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

const isEmpty = value => typeof value == 'string' ? value.length == 0
  : value == null ? true
  : typeof value.length == 'number' ? value.length == 0
  : typeof value.size == 'number' ? value.size == 0
  : value.constructor == Object ? objectKeysLength(value) == 0
  : false

export default isEmpty
