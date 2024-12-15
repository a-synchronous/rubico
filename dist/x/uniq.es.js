/**
 * rubico v2.6.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2024 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

const uniq = arr => {
  if (!isArray(arr)) throw Error('uniq(arr): arr is not an array')
  return [...new Set(arr)]
}

export default uniq
