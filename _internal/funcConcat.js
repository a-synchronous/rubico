const isPromise = require('./isPromise')

/**
 * @name funcConcat
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcConcat<
 *   args ...any,
 *   intermediate any,
 *   result any,
 * >(
 *   funcA ...args=>Promise|intermediate,
 *   funcB intermediate=>result
 * ) -> pipedFunction ...args=>Promise|result
 * ```
 */
const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

module.exports = funcConcat
