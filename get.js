const getByPath = require('./_internal/getByPath')

/**
 * @name get
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value any,
 *   path string|number|Array<string|number>,
 *   defaultValue (value=>any)|any
 *
 * get(path, defaultValue?) -> getter value=>any
 * ```
 *
 * @description
 * Create a getter that accesses a property on a value denoted by path.
 *
 * ```javascript [playground]
 * console.log(
 *   get('hello')({ hello: 'world' }),
 * ) // world
 * ```
 *
 * It is possible to return a default value on not found by supplying the value or resolver of such value as the second parameter.
 *
 * ```javascript [playground]
 * console.log(
 *   get('hello', 'default')({ foo: 'bar' }),
 * ) // default
 *
 * console.log(
 *   get('hello', object => object.foo)({ foo: 'bar' }),
 * ) // bar
 * ```
 *
 * `get` supports three types of path patterns for nested property access.
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * const nestedABC0 = { a: { b: { c: ['hello'] } } }
 *
 * console.log(
 *   get('a.b.c[0]')(nestedABC0),
 * ) // hello
 *
 * const nested00000 = [[[[['foo']]]]]
 *
 * console.log(
 *   get('0.0.0.0.0')(nested00000),
 * ) // foo
 *
 * console.log(
 *   get('[0][0][0][0][0]')(nested00000),
 * ) // foo
 *
 * console.log(
 *   get([0, 0, 0, 0, 0])(nested00000),
 * ) // foo
 * ```
 */
const get = (path, defaultValue) => function getter(value) {
  const result = value == null ? undefined : getByPath(value, path)
  return result === undefined
    ? typeof defaultValue == 'function' ? defaultValue(value) : defaultValue
    : result
}

module.exports = get
