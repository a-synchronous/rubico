/**
 * rubico v1.6.10
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, omit) {
  if (typeof module == 'object') (module.exports = omit) // CommonJS
  else if (typeof define == 'function') define(() => omit) // AMD
  else (root.omit = omit) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const omit = keys => function omitting(source) {
  if (source == null) {
    return source
  }
  const keysLength = keys.length,
    result = { ...source }
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    delete result[keys[keysIndex]]
  }
  return result
}

return omit
}())))
