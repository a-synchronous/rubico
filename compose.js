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
 * type Function = (...arguments)=>Promise|any
 * type UnaryFunction = any=>Promise|any
 *
 * funcs [Function, ...Array<UnaryFunction>]
 *
 * compose(funcs)(...arguments) -> result Promise|any
 * compose(...arguments, funcs) -> result Promise|any
 * compose(...funcs)(...arguments) -> result Promise|any
 * ```
 *
 * @description
 * Creates a function composition from multiple functions. Each function in the function composition is evaluated in series starting from the last function in the function composition, passing its return value as the first and only argument to the previous function in the function composition. The result of the execution of a function composition is the return value of the first function in the function composition. If any function in the function composition is asynchronous, the result of the execution of the function composition is a promise.
 *
 * Multiple arguments may be provided to a function composition, in which case they are passed directly to the last function in the function composition.
 *
 * ```javascript [playground]
 * const f = x => x * 2
 * const g = x => x + 3
 *
 * const result = compose(5, [f, g])
 *
 * console.log(result)
 * ```
 *
 * Functions may be passed to `compose` as arguments instead of as items of an array.
 *
 * ```javascript [playground]
 * const f = x => x * 2
 * const g = x => x + 1
 *
 * const composition = compose(f, g)
 *
 * console.log(composition(1))
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * compose(Promise.resolve(1), 2, Promise.resolve(3), [
 *   console.log,
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
