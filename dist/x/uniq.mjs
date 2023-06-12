/**
 * rubico v2.0.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2023 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

const uniq = arr => {
  if (!isArray(arr)) throw Error('uniq(arr): arr is not an array')
  return [...new Set(arr)]
}

export default uniq
