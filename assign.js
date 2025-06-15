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
 * args Array<any>
 *
 * type UnarySyncOrAsyncResolver = any=>Promise|any
 *
 * objectResolversOrPromisesOrValues Object<UnarySyncOrAsyncResolver|Promise|any>
 *
 * assign(argumentObject Promise|Object, objectResolversOrPromisesOrValues) -> resultObject
 * assign(objectResolversOrPromisesOrValues)(argumentObject Object) -> resultObject
 * ```
 *
 * @description
 * Function equivalent to [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). Constructs an object `result` from an object `objectResolversOrPromisesOrValues` of resolvers, promises, values, or a mix thereof and an argument object `argumentObject`.
 *
 * If any values of `objectResolversOrPromisesOrValues` are resolvers, `assign` provides the `argumentObject` to those resolvers to resolve the values for assignment in `resultObject`.
 *
 * ```javascript [playground]
 * const assignSquaredAndCubed = assign({
 *   squared: ({ number }) => number ** 2,
 *   cubed: ({ number }) => number ** 3,
 *   n: 1,
 * })
 *
 * console.log(assignSquaredAndCubed({ number: 2 }))
 * // { number: 2, squared: 4, cubed: 8, n: 1 }
 *
 * console.log(assignSquaredAndCubed({ number: 3 }))
 * // { number: 3, squared: 9, cubed: 27, n: 1 }
 * ```
 *
 * If any of the resolvers in `objectResolversOrPromisesOrValues` are asynchronous, `assign` returns a promise of `resultObject`.
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
