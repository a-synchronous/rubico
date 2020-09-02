const { tap } = require('..')

const consoleLog = console.log

const isPromise = value => value != null && typeof value.then == 'function'

/**
 * @name funcConcat
 *
 * @synopsis
 * any -> A, any -> B, any -> C
 *
 * funcConcat(funcA A=>B, funcB B=>C) -> pipedFunction A=>C
 */
const funcConcat = (funcA, funcB) => function piped(...args) {
  const intermediate = funcA.apply(null, args)
  return isPromise(intermediate)
    ? intermediate.then(res => funcB.call(null, res))
    : funcB.call(null, intermediate)
}

/**
 * @name _trace
 *
 * @synopsis
 * _trace(value any) -> value
 */
const _trace = function (value) {
  consoleLog(value)
  return value
}

/**
 * @name trace
 *
 * @synopsis
 * trace(value function) -> traceResolver (deferredValue any)=>Promise|deferredValue
 *
 * trace(value !function) -> value
 */
const trace = function (value) {
  if (typeof value == 'function') {
    return funcConcat(value, _trace)
  }
  return _trace(value)
}

module.exports = trace
