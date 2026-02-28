/**
 * Rubico v2.8.3
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
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
