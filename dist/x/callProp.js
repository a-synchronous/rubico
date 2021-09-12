/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, callProp) {
  if (typeof module == 'object') (module.exports = callProp) // CommonJS
  else if (typeof define == 'function') define(() => callProp) // AMD
  else (root.callProp = callProp) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const callProp = (property, ...args) => function callingProp(object) {
  return object[property](...args)
}

return callProp
}())))
