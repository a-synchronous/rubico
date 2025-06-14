const curry2 = require('./_internal/curry2')
const __ = require('./_internal/placeholder')
const promiseAll = require('./_internal/promiseAll')
const funcApply = require('./_internal/funcApply')
const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const funcConcat = require('./_internal/funcConcat')

/**
 * @name compose
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcs Array<function>
 * args Array<any>
 * argsWithPromises Array<Promise|any>
 *
 * compose(funcs)(...args) -> result Promise|any
 *
 * compose(...argsWithPromises, funcs) -> result Promise|any
 *
 * compose(...funcs)(...args) -> result Promise|any
 * ```
 *
 * @description
 * Creates a function composition from multiple functions. Each function in the composition is evaluated starting from the last function in the composition in series, passing its return value as an argument to the previous function. The result of a composition execution is the return value of the first function in the composition. If any function in the composition is asynchronous, the result of the composition execution is a Promise.
 *
 * ```javascript [playground]
 * const f = x => x * 2
 * const g = x => x + 3
 *
 * const result = compose(5, [f, g])
 * console.log(result) // 16
 * ```
 *
 * `compose` supports a mathematical API.
 *
 * ```javascript [playground]
 * const f = x => x * 2
 * const g = x => x + 1
 *
 * const composition = compose(f, g)
 *
 * console.log(composition(1)) // 4
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * compose(Promise.resolve(1), 2, Promise.resolve(3), [
 *   console.log, // [1, 2, 3]
 * ])
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [tap](/docs/tap)
 *  * [switchCase](/docs/switchCase)
 *  * [tryCatch](/docs/tryCatch)
 */
const compose = function (...args) {
  if (typeof args[0] == 'function') {
    return args.reduceRight(funcConcat)
  }

  const funcs = args.pop()
  const composition = funcs.reduceRight(funcConcat)

  if (args.length == 0) {
    return composition
  }

  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(funcApply, composition, __))
  }

  return composition(...args)
}

module.exports = compose
