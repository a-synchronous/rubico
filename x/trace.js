const funcConcat = require('../_internal/funcConcat')
const tap = require('../tap')

// ...any => ()
const consoleLog = console.log

/**
 * @name trace
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   resolved any,
 *   resolver ...args=>resolved
 *
 * trace(...args) -> args[0]
 *
 * trace(resolver)(...args) -> resolved
 * ```
 *
 * @description
 * Log a value out to the console, returning the value. If the value is a function, treat it as a resolver.
 *
 * ```javascript [playground]
 * import trace from 'https://unpkg.com/rubico/dist/x/trace.es.js'
 *
 * pipe([
 *   trace,
 *   trace(value => value.toUpperCase()),
 * ])('hey') // hey
 *           // HEY
 * console.log('check your console')
 * ```
 */
const trace = function (...args) {
  const arg0 = args[0]
  if (typeof arg0 == 'function') {
    return tap(funcConcat(arg0, consoleLog))
  }
  return tap(consoleLog)(...args)
}

module.exports = trace
