const objectAssign = require('./_internal/objectAssign')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const funcObjectAll = require('./_internal/funcObjectAll')

/**
 * @name assign
 *
 * @synopsis
 * ```coffeescript [specscript]
 * assign(
 *   funcs Object<source=>Promise|any>,
 * )(source Object) -> resultsMergedWithSource Promise|Object
 * ```
 *
 * @description
 * Compose an object from a source object merged with the evaluations of the property functions of a specifying object of functions. Functions of the specifying object of functions may be asynchronous.
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
      ? result.then(curry2(objectAssign, value, __))
      : ({ ...value, ...result })
  }
}

module.exports = assign
