/**
 * rubico v1.6.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, trace) {
  if (typeof module == 'object') (module.exports = trace) // CommonJS
  else if (typeof define == 'function') define(() => trace) // AMD
  else (root.trace = trace) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isPromise = value => value != null && typeof value.then == 'function'

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

const tapSync = func => function tapping(...args) {
  func(...args)
  return args[0]
}

// ...any => ()
const tapLog = tapSync(console.log)

const trace = function (...args) {
  const arg0 = args[0]
  if (typeof arg0 == 'function') {
    return funcConcat(arg0, tapLog)
  }
  return tapLog(...args)
}

return trace
}())))
