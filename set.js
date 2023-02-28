const isPromise = require('./_internal/isPromise')
const setByPath = require('./_internal/setByPath')
const curry3 = require('./_internal/curry3')
const __ = require('./_internal/placeholder')

/**
 * @name set
 *
 * @synopsis
 * ```coffeescript [specscript]
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
 * console.log(set('a', 1)({ b: 2 })) // { a: 1, b: 2 }
 *
 * const nestedAC2 = { a: { c: 2 } }
 *
 * console.log(set('a.b', 1)(nestedAC2)) // { a : { b: 1, c: 2 }}
 *
 * const nestedA0BC3 = { a: [{ b: { c: 3 } }] }
 *
 * console.log(set('a[0].b.c', 4)(nestedA0BC3)) // { a: [{ b: { c: 4 } }] }
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
 * @since 1.7.0
 */

const set = (path, value) => function setter(obj) {
  if (typeof value == 'function') {
    const actualValue = value(obj)
    if (isPromise(actualValue)) {
      return actualValue.then(
        curry3(setByPath, obj, __, path)
      )
    }
    return setByPath(obj, actualValue, path)
  }
  return setByPath(obj, value, path)
}

module.exports = set
