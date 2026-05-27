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
 * omit(object Promise|Object, paths Array<string>) -> result Object
 *
 * omit(paths Array<string>)(object Object) -> result Object
 * ```
 *
 * @description
 * Object constructor. Creates a new object by excluding provided paths on an argument object.
 *
 * ```javascript [playground]
 * const argumentObject = { _id: '1', name: 'John' }
 *
 * const newObject = omit(argumentObject, ['_id'])
 *
 * console.log(newObject)
 * ```
 *
 * `omit` supports three types of path patterns for nested property access
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * const omittedABD = omit(['a.b.d'])({
 *   a: {
 *     b: {
 *       c: 'hello',
 *       d: 'goodbye',
 *     },
 *   },
 * })
 *
 * console.log(omittedABD)
 * ```
 *
 * `omit` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * pipe({ a: 1, b: 2, c: 3 }, [
 *   map(number => number ** 2),
 *   omit(['a', 'b']),
 *   console.log,
 * ])
 * ```
 *
 * If the argument object is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * omit(Promise.resolve({ a: 1, b: 2, c: 3 }), ['a', 'b']).then(console.log)
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
