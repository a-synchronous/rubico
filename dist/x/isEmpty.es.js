/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
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
