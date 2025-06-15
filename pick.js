const isPromise = require('./_internal/isPromise')
const getByPath = require('./_internal/getByPath')
const setByPath = require('./_internal/setByPath')
const curry2 = require('./_internal/curry2')
const __ = require('./_internal/placeholder')

// _pick(source Object, keys Array<string>) -> result Object
const _pick = function (source, keys) {
  if (source == null) {
    return source
  }
  const keysLength = keys.length
  let result = {}
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex],
      value = getByPath(source, key)
    if (value != null) {
      result = setByPath(result, value, key)
    }
  }
  return result
}

/**
 * @name pick
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pick(source Promise|Object, keys Array<string>) -> result Object
 * pick(keys Array<string>)(source Object) -> result Object
 * ```
 *
 * @description
 * Creates a new object from a source object by selecting provided keys. If a provided key does not exist on the source object, excludes it from the resulting object.
 *
 * ```javascript [playground]
 * console.log(
 *   pick({ goodbye: 1, world: 2 }, ['hello', 'world']),
 * ) // { world: 2 }
 * ```
 *
 * `pick` supports three types of path patterns for nested property access
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * const nested = { a: { b: { c: { d: 1, e: [2, 3] } } } }
 *
 * console.log(pick(['a.b.c.d'])(nested)) // { a: { b: { c: { d: 1 } } } }
 * ```
 *
 * Compose `pick` inside a `pipe` with its lazy API.
 *
 * ```javascript [playground]
 * pipe({ a: 1, b: 2, c: 3 }, [
 *   map(number => number ** 2),
 *   pick(['a', 'c']),
 *   console.log, // { a: 1, c: 9 }
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * pick(Promise.resolve({ a: 1, b: 2, c: 3 }), ['a', 'b']).then(console.log)
 * // { a: 1, b: 2 }
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [all](/docs/all)
 *  * [assign](/docs/assign)
 *  * [get](/docs/get)
 *  * [set](/docs/set)
 *  * [omit](/docs/omit)
 *  * [forEach](/docs/forEach)
 */
const pick = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_pick, __, arg0)
  }
  if (isPromise(arg0)) {
    return arg0.then(curry2(_pick, __, arg1))
  }
  return _pick(arg0, arg1)
}

module.exports = pick
