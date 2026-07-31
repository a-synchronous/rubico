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
 * type Function = (...arguments)=>Promise|any
 * type UnaryFunction = any=>Promise|any
 *
 * funcs [Function, ...Array<UnaryFunction>]
 *
 * pipe(funcs)(...arguments) -> result Promise|any
 * pipe(...arguments, funcs) -> result Promise|any
 * pipe(...funcs)(...arguments) -> result Promise|any
 * ```
 *
 * @description
 * Creates a function pipeline from multiple functions. Each function in the function pipeline is evaluated in series starting from the first function in the function pipeline, passing the return value as the first and only argument to the next function in the pipeline. The result of the execution of a function pipeline is the return value of the last function in the function pipeline. If any function in the function pipeline is asynchronous, the result of the execution of the function pipeline is a promise.
 *
 * Multiple arguments may be provided to a function pipeline, in which case they are passed directly to the first function in the function pipeline.
 *
 * ```javascript [playground]
 * function add(a, b, c) {
 *   return a + b + c
 * }
 *
 * const pipeline = pipe([
 *   add,
 *   console.log,
 * ])
 *
 * pipeline(1, 2, 3)
 * ```
 *
 * Functions may be passed to `pipe` as arguments instead of as items of an array.
 *
 * ```javascript [playground]
 * const appendB = x => x + 'b'
 * const appendC = x => x + 'c'
 *
 * const appendBC = pipe(appendB, appendC)
 *
 * console.log(appendBC('a'))
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * pipe(Promise.resolve(1), 2, Promise.resolve(3), [
 *   console.log,
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
