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
 * _trace(value, args ...any) -> value
 */
const _trace = function (value, ...args) {
  consoleLog(value, ...args)
  return value
}

/**
 * @name trace
 *
 * @synopsis
 */
const trace = function (value, ...args) {
  if (typeof value == 'function') {
    return funcConcat(value, _trace)
  }
  return _trace(value, ...args)
}

module.exports = trace
