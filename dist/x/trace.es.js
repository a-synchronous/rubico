/**
 * rubico v1.6.7
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

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

export default trace
