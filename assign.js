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
 * type UnarySyncOrAsyncResolver = any=>Promise|any
 *
 * assign(Promise|Object, Object<UnarySyncOrAsyncResolver|Promise|any>) -> Promise|Object
 * assign(Object<UnarySyncOrAsyncResolver|Promise|any>)(Object) -> Promise|Object
 * ```
 *
 * @description
 * Function composer and data constructor. Constructs a new object from an argument object and an object of resolvers, promises, or values.
 *
 * If provided resolver functions, `assign` resolves the values to be assigned at the keys of the resolver functions in the new object by calling those resolvers with the argument object.
 *
 * ```javascript [playground]
 * const assignSquaredAndCubed = assign({
 *   squared: ({ number }) => number ** 2,
 *   cubed: ({ number }) => number ** 3,
 * })
 *
 * console.log(assignSquaredAndCubed({ number: 2 }))
 * console.log(assignSquaredAndCubed({ number: 3 }))
 *
 * const n = 1
 * const assignN = assign({ n })
 *
 * console.log(assignN({}))
 * ```
 *
 * If any of the resolvers provided to `assign` are asynchronous, the execution of `assign` with the argument object returns a promise.
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
 * const promise = asyncAssignTotal({ numbers: [1, 2, 3, 4, 5] })
 *
 * promise.then(console.log)
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution.
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
