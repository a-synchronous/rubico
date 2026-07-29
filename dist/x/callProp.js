/**
 * rubico may be freely distributed under the CFOSS license.
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
