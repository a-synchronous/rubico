const { tap } = require('..')

const consoleLog = console.log

const tapConsoleLog = tap(consoleLog)

const isPromise = value => value != null && typeof value.then == 'function'

/**
 * @name funcConcat
 *
 * @synopsis
 * any -> A, any -> B, any -> C
 *
 * funcConcat(
 *   funcA (args ...any)=>(intermediate any),
 *   funcB intermediate=>(result any)
 * ) -> pipedFunction ...args=>result
 */
const funcConcat = (funcA, funcB) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

/**
 * @name trace
 *
 * @synopsis
 * ```coffeescript [specscript]
 * trace(value any) -> value
 *
 * trace<args ...any>(
 *   resolver ...args=>Promise|any
 * ) -> lazyTracer ...args=>Promise|args[0],
 * ```
 *
 * @description
 * Log a value out to the console, returning the value. If the value is a function, treat it as a resolver.
 *
 * ```javascript [playground]
 * pipe([
 *   trace,
 *   trace(value => value.toUpperCase()),
 * ])('hey') // hey
 *           // HEY
 * ```
 */
const trace = function (...args) {
  const point = args[0]
  if (typeof point == 'function') {
    return funcConcat(point, tapConsoleLog)
  }
  return tapConsoleLog(...args)
}

module.exports = trace
