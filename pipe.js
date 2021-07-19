const noop = require('./_internal/noop')
const funcConcat = require('./_internal/funcConcat')
const funcConcatSync = require('./_internal/funcConcatSync')
const isGeneratorFunction = require('./_internal/isGeneratorFunction')
const isAsyncGeneratorFunction = require('./_internal/isAsyncGeneratorFunction')

/**
 * @name pipe
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 *
 * var args ...any,
 *   funcs [
 *     ...args=>Promise|any,
 *     ...Array<any=>Promise|any>,
 *   ],
 *   transducers Array<Reducer=>Reducer>
 *   reducer Reducer,
 *
 * pipe(funcs)(...args) -> Promise|any
 *
 * pipe(transducers)(reducer) -> Reducer
 * ```
 *
 * @description
 * Create a function pipeline, where each function passes its return value as a single argument to the next function until all functions have executed. The result of a pipeline execution is the return of its last function.
 *
 * ```javascript [playground]
 * console.log(
 *   pipe([
 *     number => number + 1,
 *     number => number + 2,
 *     number => number + 3,
 *   ])(5),
 * ) // 11
 * ```
 *
 * In order to create pipelines of transducers that read left to right, `pipe` chains the functions (assuming they are transducers) in reverse when passed a reducer in argument position. This results in a reducer with chained functionality. For more information on this behavior, see [this blog post on transducers](https://rubico.land/blog/2020/10/02/transducers-crash-course).
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const square = number => number ** 2
 *
 * const add = (a, b) => a + b
 *
 * const squaredOdds = pipe([
 *   filter(isOdd),
 *   map(square),
 * ])
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squaredOdds(add), 0),
 * ) // 35
 *
 * console.log(
 *   squaredOdds([1, 2, 3, 4, 5])
 * ) // [1, 9, 25]
 * ```
 *
 * @execution series
 *
 * @transducing
 *
 * @since 1.6.0
 */
const pipe = function (funcs) {
  let functionPipeline = noop,
    functionComposition = noop
  return function pipeline(...args) {
    const firstArg = args[0]
    if (
      typeof firstArg == 'function'
        && !isGeneratorFunction(firstArg)
        && !isAsyncGeneratorFunction(firstArg)
    ) {
      if (functionComposition == noop) {
        functionComposition = funcs.reduceRight(funcConcat)
      }
      return functionComposition(...args)
    }
      if (functionPipeline == noop) {
        functionPipeline = funcs.reduce(funcConcat)
      }
    return functionPipeline(...args)
  }
}

// funcs Array<function> -> pipeline function
const pipeSync = funcs => funcs.reduce(funcConcatSync)

/**
 * @name pipe.sync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   funcs [...args=>any, ...Array<any=>any>]
 *
 * pipe.sync(funcs) -> syncPipeline ...args=>any
 * ```
 *
 * @description
 * `pipe` that doesn't automatically resolve promises. This variant is a good option if more performance is desired or if manual promise handling is required.
 *
 * ```javascript [playground]
 * pipe.sync([
 *   value => Promise.resolve(value),
 *   promise => promise.then(console.log)
 * ])('hey') // hey
 * ```
 */
pipe.sync = pipeSync

module.exports = pipe
