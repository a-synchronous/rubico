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
 * pipe(funcs Array<function>)(...argumentsForFirstFunction) -> result any
 *
 * pipe(...argumentsForFirstFunction, funcs Array<function>) -> result any
 * ```
 *
 * @description
 * Create a function pipeline where each function passes its return value as a single argument to the next function until all functions have executed. The result of a pipeline execution is the return of its last function. If any function of the pipeline is asynchronous, the result of the execution is a Promise.
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
 * @execution series
 *
 * @transducing
 *
 * @since 1.6.0
 */
const pipe = function (...args) {
  const funcs = args.pop()

  if (args.length > 0) {
    return funcs.reduce(funcConcat)(...args)
  }

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
      return functionComposition(firstArg)
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
