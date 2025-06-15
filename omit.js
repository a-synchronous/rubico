const isPromise = require('./_internal/isPromise')
const deleteByPath = require('./_internal/deleteByPath')
const copyDeep = require('./_internal/copyDeep')
const curry2 = require('./_internal/curry2')
const __ = require('./_internal/placeholder')

// _omit(source Object, paths Array<string>) -> result Object
const _omit = function (source, paths) {
  const pathsLength = paths.length,
    result = copyDeep(source)
  let pathsIndex = -1
  while (++pathsIndex < pathsLength) {
    deleteByPath(result, paths[pathsIndex])
  }
  return result
}

/**
 * @name omit
 *
 * @synopsis
 * ```coffeescript [specscript]
 * omit(source Promise|Object, paths Array<string>) -> result Object
 * omit(paths Array<string>)(source Object) -> result Object
 * ```
 *
 * @description
 * Create a new object by excluding provided paths on a source object.
 *
 * ```javascript [playground]
 * console.log(
 *   omit({ _id: '1', name: 'John' }, ['_id']),
 * ) // { name: 'John' }
 * ```
 *
 * `omit` supports three types of path patterns for nested property access
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * console.log(
 *   omit(['a.b.d'])({
 *     a: {
 *       b: {
 *         c: 'hello',
 *         d: 'goodbye',
 *       },
 *     },
 *   }),
 * ) // { a: { b: { c: 'hello' } } }
 * ```
 *
 * Compose `omit` inside a `pipe` with its lazy API
 *
 * ```javascript [playground]
 * pipe({ a: 1, b: 2, c: 3 }, [
 *   map(number => number ** 2),
 *   omit(['a', 'b']),
 *   console.log, // { c: 9 }
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * omit(Promise.resolve({ a: 1, b: 2, c: 3 }), ['a', 'b']).then(console.log)
 * // { c: 3 }
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [all](/docs/all)
 *  * [assign](/docs/assign)
 *  * [get](/docs/get)
 *  * [set](/docs/set)
 *  * [pick](/docs/pick)
 *  * [forEach](/docs/forEach)
 */
const omit = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_omit, __, arg0)
  }
  if (isPromise(arg0)) {
    return arg0.then(curry2(_omit, __, arg1))
  }
  return _omit(arg0, arg1)
}

module.exports = omit
