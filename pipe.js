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
 * args Array<any>
 * argsOrPromises Array<Promise|any>
 *
 * type SyncOrAsyncFunction = (...args)=>Promise|any
 * type UnarySyncOrAsyncFunction = any=>Promise|any
 *
 * funcs [SyncOrAsyncFunction, ...Array<UnarySyncOrAsyncFunction>]
 *
 * pipe(funcs)(...args) -> result Promise|any
 * pipe(...argsOrPromises, funcs) -> result Promise|any
 * pipe(...funcs)(...args) -> result Promise|any
 * ```
 *
 * @description
 * Creates a function pipeline from multiple functions. Each function in the pipeline is evaluated in series, passing its return value as an argument to the next function. The result of a pipeline execution is the return value of the last function in the pipeline. All arguments provided to the pipeline are provided to the first function in the pipeline. If any function in the pipeline is asynchronous, the result of the pipeline execution is a Promise.
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
 * `pipe` supports a mathematical API.
 *
 * ```javascript [playground]
 * const appendB = x => x + 'b'
 * const appendC = x => x + 'c'
 *
 * const appendBC = pipe(appendB, appendC)
 *
 * console.log(appendBC('a')) // 'abc'
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
  if (typeof args[0] == 'function') {
    return args.reduce(funcConcat)
  }

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
