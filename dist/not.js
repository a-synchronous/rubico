/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, not) {
  if (typeof module == 'object') (module.exports = not) // CommonJS
  else if (typeof define == 'function') define(() => not) // AMD
  else (root.not = not) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isPromise = value => value != null && typeof value.then == 'function'

// true -> false
const _not = value => !value

const not = func => function logicalInverter(value) {
  if (value != null && typeof value.not == 'function') {
    return value.not(func)
  }
  const boolean = func(value)
  return isPromise(boolean) ? boolean.then(_not) : !boolean
}

const notSync = func => function notSync(...args) {
  return !func(...args)
}

not.sync = notSync

return not
}())))
