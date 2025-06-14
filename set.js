const isPromise = require('./_internal/isPromise')
const setByPath = require('./_internal/setByPath')
const curry3 = require('./_internal/curry3')
const __ = require('./_internal/placeholder')

/**
 * @name _set
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _set(
 *   obj Object,
 *   path string|Array<string|number>,
 *   value function|any,
 * ) -> result Promise|Object
 * ```
 */
const _set = function (obj, path, value) {
  if (typeof value == 'function') {
    const actualValue = value(obj)
    if (isPromise(actualValue)) {
      return actualValue.then(
        curry3(setByPath, obj, __, path)
      )
    }
    return setByPath(obj, actualValue, path)
  }
  if (isPromise(value)) {
    return value.then(
      curry3(setByPath, obj, __, path)
    )
  }
  return setByPath(obj, value, path)
}

/**
 * @name set
 *
 * @synopsis
 * ```coffeescript [specscript]
 * set(
 *   object Promise|Object,
 *   path string|Array<string|number>,
 *   value function|any,
 * ) -> result Promise|Object
 *
 * set(
 *   path string|Array<string|number>,
 *   value function|any,
 * )(object Object) -> result Promise|Object
 * ```
 *
 * @description
 * Sets a property on a new object shallow cloned from the argument object given a path denoted by a string, number, or an array of string or numbers.
 *
 * `set` supports three types of path patterns for nested property access.
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * console.log(set({ b: 2 }, 'a', 1)) // { a: 1, b: 2 }
 *
 * const nestedAC2 = { a: { c: 2 } }
 *
 * console.log(set(nestedAC2, 'a.b', 1)) // { a : { b: 1, c: 2 }}
 *
 * const nestedA0BC3 = { a: [{ b: { c: 3 } }] }
 *
 * console.log(set(nestedA0BC3, 'a[0].b.c', 4)) // { a: [{ b: { c: 4 } }] }
 * ```
 *
 * The property value may be a function, in which case it is treated as a resolver and provided the argument object to resolve the value to set.
 *
 * ```javascript [playground]
 * const myObj = { a: 1 }
 *
 * const myNewObj = set('b', obj => obj.a + 2)(myObj)
 *
 * console.log(myNewObj) // { a: 1, b: 3 }
 * ```
 *
 * `set` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe({ a: 1 }, [
 *   set('b', 2),
 *   console.log, // { a: 1, b: 2 }
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * set(Promise.resolve({}), 'a', 1).then(console.log) // { a: 1 }
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [all](/docs/all)
 *  * [assign](/docs/assign)
 *  * [get](/docs/get)
 *  * [pick](/docs/pick)
 *  * [omit](/docs/omit)
 *  * [forEach](/docs/forEach)
 *
 * @since 1.7.0
 */

const set = function (arg0, arg1, arg2) {
  if (arg2 == null) {
    return curry3(_set, __, arg0, arg1)
  }
  if (isPromise(arg0)) {
    return arg0.then(curry3(_set, __, arg1, arg2))
  }
  return _set(arg0, arg1, arg2)
}

module.exports = set
