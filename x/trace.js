const funcConcat = require('../_internal/funcConcat')
const tapSync = require('../_internal/tapSync')

// ...any => ()
const tapLog = tapSync(console.log)

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
 * ```javascript [node]
 * pipe([
 *   trace,
 *   trace(value => value.toUpperCase()),
 * ])('hey') // hey
 *           // HEY
 * ```
 */
const trace = function (...args) {
  const arg0 = args[0]
  if (typeof arg0 == 'function') {
    return funcConcat(arg0, tapLog)
  }
  return tapLog(...args)
}

module.exports = trace
