/**
 * rubico v1.6.27
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, pick) {
  if (typeof module == 'object') (module.exports = pick) // CommonJS
  else if (typeof define == 'function') define(() => pick) // AMD
  else (root.pick = pick) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const pick = keys => function picking(source) {
  if (source == null) {
    return source
  }
  const keysLength = keys.length,
    result = {}
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex],
      value = source[key]
    if (value != null) {
      result[key] = value
    }
  }
  return result
}

return pick
}())))
