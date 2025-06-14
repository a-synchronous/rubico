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
 * assign(
 *   o Promise|Object,
 *   resolversOrValues Object<function|Promise|any>
 * ) -> result Promise|Object
 *
 * assign(
 *   resolversOrValues Object<function|Promise|any>
 * )(o Object) -> result Promise|Object
 * ```
 *
 * @description
 * Function executor and composer. Accepts an object of resolver functions or values and an object `o`. Creates a result object from the argument object, evaluates each resolver with the argument object, and assigns to the result object the evaluations at the corresponding resolver keys.
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
 * Values passed in resolver position are set on the result object directly. If any of these values are promises, they are resolved for their values before being set on the result object.
 *
 * ```javascript [playground]
 * assign({}, {
 *   a: 1,
 *   b: Promise.resolve(2),
 *   c: () => 3,
 *   d: async o => Object.keys(o).length,
 * }).then(console.log) // { a: 1, b: 2, c: 3, d: 0 }
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * assign(Promise.resolve({}), {
 *   a() {
 *     return 1
 *   },
 *   b() {
 *     return 2
 *   },
 * }).then(console.log)
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [all](/docs/all)
 *  * [get](/docs/get)
 *  * [set](/docs/set)
 *  * [pick](/docs/pick)
 *  * [omit](/docs/omit)
 *  * [forEach](/docs/forEach)
 *
 * @execution concurrent
 */
const assign = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_assign, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_assign, __, arg1))
    : _assign(arg0, arg1)
}

module.exports = assign
