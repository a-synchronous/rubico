const getByPath = require('./_internal/getByPath')

/**
 * @name get
 *
 * @synopsis
 * ```coffeescript [specscript]
 * get(
 *   path string|number|Array<string|number>,
 *   defaultValue function|any
 * )(object Object) -> result Promise|Object
 * ```
 *
 * @description
 * Accesses a property of an object given a path denoted by a string, number, or an array of string or numbers.
 *
 * ```javascript [playground]
 * const getHello = get('hello')
 *
 * console.log(getHello({ hello: 'world' })) // world
 * ```
 *
 * If the value at the end of the path is not found on the object, returns an optional default value. The default value can be a function resolver that takes the object as an argument. If no default value is provided, returns `undefined`. The function resolver may be asynchronous (returns a promise).
 *
 * ```javascript [playground]
 * const getHelloWithDefaultValue = get('hello', 'default')
 *
 * console.log(getHelloWithDefaultValue({ foo: 'bar' })) // default
 *
 * const getHelloWithDefaultResolver = get('hello', object => object.foo)
 *
 * console.log(getHelloWithDefaultResolver({ foo: 'bar' })) // bar
 * ```
 *
 * `get` supports three types of path patterns for nested property access.
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * const getABC0 = get('a.b.c[0]')
 *
 * console.log(getABC0({ a: { b: { c: ['hello'] } } })) // hello
 *
 * const get00000DotNotation = get('0.0.0.0.0')
 * const get00000BracketNotation = get('[0][0][0][0][0]')
 * const get00000ArrayNotation = get([0, 0, 0, 0, 0])
 *
 * console.log(get00000DotNotation([[[[['foo']]]]])) // foo
 * console.log(get00000BracketNotation([[[[['foo']]]]])) // foo
 * console.log(get00000ArrayNotation([[[[['foo']]]]])) // foo
 * ```
 */
const get = (path, defaultValue) => function getter(value) {
  const result = value == null ? undefined : getByPath(value, path)
  return result === undefined
    ? typeof defaultValue == 'function' ? defaultValue(value) : defaultValue
    : result
}

module.exports = get
