const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const promiseAll = require('./_internal/promiseAll')
const funcConcat = require('./_internal/funcConcat')
const funcApply = require('./_internal/funcApply')
const curry2 = require('./_internal/curry2')
const __ = require('./_internal/placeholder')

/**
 * @name pipe
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pipe(funcs Array<function>)(...args) -> result Promise|any
 *
 * pipe(...args, funcs Array<function>) -> result Promise|any
 * ```
 *
 * @description
 * Creates a function pipeline from an array of functions, where each function passes its return value as a single argument to the next function until all functions have executed. The first function is called with the arguments to the pipeline, while the result of the pipeline execution is the return of its last function. If any function of the pipeline is asynchronous, the result of the execution is a Promise.
 *
 * ```javascript [playground]
 * const syncAdd123 = pipe([
 *   number => number + 1,
 *   number => number + 2,
 *   number => number + 3,
 * ])
 *
 * console.log(syncAdd123(5)) // 11
 *
 * const asyncAdd123 = pipe([
 *   async number => number + 1,
 *   async number => number + 2,
 *   async number => number + 3,
 * ])
 *
 * asyncAdd123(5).then(console.log) // 11
 * ```
 *
 * When passed any amount of arguments before the array of functions, `pipe` executes eagerly; the array of functions is immediately invoked with the supplied arguments.
 *
 * ```javascript [playground]
 * pipe(1, 2, 3, [
 *   Array.of,
 *   map(number => number * 3),
 *   console.log, // [3, 6, 9]
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * pipe(Promise.resolve(1), 2, Promise.resolve(3), [
 *   console.log, // [1, 2, 3]
 * ])
 * ```
 *
 * See also:
 *  * [compose](/docs/compose)
 *  * [tap](/docs/tap)
 *  * [switchCase](/docs/switchCase)
 *  * [tryCatch](/docs/tryCatch)
 *
 * @execution series
 *
 * @transducing
 *
 * @since 1.6.0
 */
const pipe = function (...args) {
  const funcs = args.pop()
  const pipeline = funcs.reduce(funcConcat)

  if (args.length == 0) {
    return pipeline
  }

  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(funcApply, pipeline, __))
  }

  return pipeline(...args)
}

module.exports = pipe
