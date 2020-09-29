/**
 * @name spread2
 *
 * @synopsis
 * ```coffeescript [specscript]
 * spread2<
 *   func function,
 *   arg0 any,
 *   arg1 any,
 * >(func) -> spreading2 ([arg0, arg1])=>func(arg0, arg1)
 * ```
 */
const spread2 = func => function spreading2([arg0, arg1]) {
  return func(arg0, arg1)
}

module.exports = spread2
