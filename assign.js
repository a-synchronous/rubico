const isPromise = require('./_internal/isPromise')
const objectAssign = require('./_internal/objectAssign')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const funcObjectAll = require('./_internal/funcObjectAll')

/**
 * @name assign
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var source Object,
 *   funcsObject Object<source=>Promise|any>
 *
 * assign(funcsObject)(source) -> resultsMergedWithSource Promise|Object
 * ```
 *
 * @description
 * Compose an object from a source object merged with its evaluations with a specifying object of functions. Functions of the specifying object may return Promises.
 *
 * ```javascript [playground]
 * console.log(
 *   assign({
 *     squared: ({ number }) => number ** 2,
 *     cubed: ({ number }) => number ** 3,
 *   })({ number: 3 }),
 * ) // { number: 3, squared: 9, cubed: 27 }
 *
 * assign({
 *   asyncNumber: async ({ number }) => number,
 * })({ number: 3 }).then(console.log) // { number: 3, asyncNumber: 3 }
 * ```
 *
 * @execution concurrent
 */
const assign = function (funcs) {
  const allFuncs = funcObjectAll(funcs)
  return function assignment(value) {
    const result = allFuncs(value)
    return isPromise(result)
      ? result.then(curry3(objectAssign, {}, value, __))
      : ({ ...value, ...result })
  }
}

module.exports = assign
