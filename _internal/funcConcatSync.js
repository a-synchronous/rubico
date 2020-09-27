/**
 * @name funcConcatSync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcConcatSync<
 *   args ...any,
 *   intermediate any,
 *   result any,
 * >(
 *   funcA ...args=>intermediate,
 *   funcB intermediate=>result
 * ) -> pipedFunction ...args=>result
 * ```
 */
const funcConcatSync = (
  funcA, funcB,
) => function pipedFunction(...args) {
  return funcB(funcA(...args))
}

module.exports = funcConcatSync
