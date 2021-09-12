/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, thunkify) {
  if (typeof module == 'object') (module.exports = thunkify) // CommonJS
  else if (typeof define == 'function') define(() => thunkify) // AMD
  else (root.thunkify = thunkify) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const thunkify = (func, ...args) => function thunk() {
  return func(...args)
}

return thunkify
}())))
