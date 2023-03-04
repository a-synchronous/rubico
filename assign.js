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
 * assign(resolvers Object<function>)(object Object) -> result Promise|Object
 * ```
 *
 * @description
 * Function executor and composer. Accepts an object of resolver functions and an argument object. Creates a result object from the argument object, evaluates each resolver with the argument object, and assigns to the result object the evaluations at the corresponding resolver keys.
 *
 * ```javascript [playground]
 * const assignSquaredAndCubed = assign({
 *   squared: ({ number }) => number ** 2,
 *   cubed: ({ number }) => number ** 3,
 * })
 *
 * console.log(assignSquaredAndCubed({ number: 2 }))
 * // { number: 2, squared: 4, cubed: 8 }
 *
 * console.log(assignSquaredAndCubed({ number: 3 }))
 * // { number: 3, squared: 9, cubed: 27 }
 * ```
 *
 * Any of the resolvers may be asynchronous and return Promises.
 *
 * ```javascript [playground]
 * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
 *
 * const asyncAssignTotal = assign({
 *   async total({ numbers }) {
 *     await sleep(500)
 *     return numbers.reduce((a, b) => a + b)
 *   },
 * })
 *
 * asyncAssignTotal({ numbers: [1, 2, 3, 4, 5] }).then(console.log)
 * // { numbers: [1, 2, 3, 4, 5], total: 15 }
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
