const isPromise = require('./_internal/isPromise')
const objectAssign = require('./_internal/objectAssign')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const curry3 = require('./_internal/curry3')
const functionObjectAll = require('./_internal/functionObjectAll')

// _assign(object Object, funcs Object<function>) -> Promise|Object
const _assign = function (object, funcs) {
  const result = functionObjectAll(funcs, [object])
  return isPromise(result)
    ? result.then(curry3(objectAssign, {}, object, __))
    : ({ ...object, ...result })
}

/**
 * @name assign
 *
 * @synopsis
 * ```coffeescript [specscript]
 * assign(object Object, resolvers Object<function>) -> result Promise|Object
 *
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
const assign = function (...args) {
  const funcs = args.pop()
  if (args.length == 0) {
    return curry2(_assign, __, funcs)
  }
  const object = args[0]
  return isPromise(object)
    ? object.then(curry2(_assign, __, funcs))
    : _assign(object, funcs)
}

module.exports = assign
