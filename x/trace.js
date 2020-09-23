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
 * @catchphrase
 * console.log as a side effect
 *
 * @synopsis
 * any -> T
 *
 * trace(
 *   reducer (any, ...any)=>Promise|any
 * ) -> tracingReducer (any, ...any)=>Promise|any,
 *
 * trace(point !function, ...restArgs) -> point
 *
 * @description
 * **trace** is essentially `tap(console.log)` but with the extended functionality of lazy evaluation when called with a function.
 *
 * ```javascript
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
