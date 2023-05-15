const funcConcat = require('./_internal/funcConcat')

/**
 * @name compose
 *
 * @synopsis
 * ```coffeescript [specscript]
 * compose(funcs Array<function>)(...args) -> result Promise|any
 *
 * compose(...args, funcs Array<function>) -> result Promise|any
 * ```
 *
 * @description
 * Creates a function composition from an array of functions, where each function passes its return value as a single argument to the previous function until all functions have executed. The last function is called with the arguments to the composition, while the result of a function composition is the return value of its first function. If any function of the composition is asynchronous, the result of the execution is a Promise. `compose` is effectively `pipe` in reverse.
 *
 * ```javascript [playground]
 * const f = number => number * 2
 *
 * const g = number => number + 3
 *
 * console.log(
 *   compose(5, [f, g]),
 * ) // 16
 * ```
 */
const compose = function (...args) {
  const funcs = args.pop()
  const composition = funcs.reduceRight(funcConcat)

  if (args.length == 0) {
    return composition
  }
  return composition(...args)
}

module.exports = compose
