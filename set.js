const isPromise = require('./_internal/isPromise')
const setByPath = require('./_internal/setByPath')
const curry3 = require('./_internal/curry3')
const __ = require('./_internal/placeholder')

/**
 * @name set
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value any,
 *   path string|Array<string|number>,
 *   value (value=>any)|any
 *
 * set(path, value) -> setter  object=>object
 * ```
 *
 * @description
 * Create a setter that sets a property on an object denoted by path.
 *
 * ```javascript [playground]
 * console.log(
 *   set('a', 1)({ b: 2 })
 * ) // { a: 1, b: 2 }
 *
 * console.log(
 *   set('a.b', 1)({ a: { c: 2 } }),
 * ) // { a : { b: 1, c: 2 }}
 *
 * console.log(
 *   set('a[0].b.c', 4)({ a: [{ b: { c: 3 } }] }),
 * ) // { a: [{ b: { c: 4 } }] }
 * ```
 *
 * The property value may be a function, in which case it is treated as a resolver and passed the argument object to resolve the value to set.
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
