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
 * keys Array<string>
 *
 * pick(Promise|Object, keys) -> Object
 * pick(keys)(Object) -> Object
 * ```
 *
 * @description
 * Object constructor. Creates a new object from an argument object by selecting keys from an array. If a key does not exist on the argument object, it is excluded from the new object.
 *
 * ```javascript [playground]
 * const argumentObject = { goodbye: 1, world: 2 }
 *
 * const newObject = pick(argumentObject, ['hello', 'world'])
 *
 * console.log(newObject)
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
 * console.log(pick(nested, ['a.b.c.d']))
 * ```
 *
 * `pick` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * pipe({ a: 1, b: 2, c: 3 }, [
 *   map(number => number ** 2),
 *   pick(['a', 'c']),
 *   console.log,
 * ])
 * ```
 *
 * If the argument object is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * pick(Promise.resolve({ a: 1, b: 2, c: 3 }), ['a', 'b']).then(console.log)
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
