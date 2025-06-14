const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const isArray = require('./_internal/isArray')
const isObject = require('./_internal/isObject')
const getByPath = require('./_internal/getByPath')

// _get(object Object, path string, defaultValue function|any)
const _get = function (object, path, defaultValue) {
  const result = object == null ? undefined : getByPath(object, path)
  return result === undefined
    ? typeof defaultValue == 'function' ? defaultValue(object) : defaultValue
    : result
}

/**
 * @name get
 *
 * @synopsis
 * ```coffeescript [specscript]
 * get(
 *   object Promise|Object,
 *   path string|number|Array<string|number>,
 *   defaultValue? function|any
 * ) -> result Promise|Object
 *
 * get(
 *   path string|number|Array<string|number>,
 *   defaultValue? function|any
 * )(object Object) -> result Promise|Object
 * ```
 *
 * @description
 * Accesses a property of an object given a path denoted by a string, number, or an array of string or numbers.
 *
 * ```javascript [playground]
 * const obj = { hello: 'world' }
 *
 * console.log(get(obj, 'hello')) // world
 * ```
 *
 * `get` supports a lazy API for composability
 *
 * ```javascript [playground]
 * const obj = { hello: 'world' }
 *
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
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * get(Promise.resolve({ a: 1 }), 'a').then(console.log) // 1
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [all](/docs/all)
 *  * [assign](/docs/assign)
 *  * [set](/docs/set)
 *  * [pick](/docs/pick)
 *  * [omit](/docs/omit)
 *  * [forEach](/docs/forEach)
 */

const get = function (arg0, arg1, arg2) {
  if (typeof arg0 == 'string' || typeof arg0 == 'number' || isArray(arg0)) {
    return curry3(_get, __, arg0, arg1)
  }
  if (isPromise(arg0)) {
    return arg0.then(curry3(_get, __, arg1, arg2))
  }
  return _get(arg0, arg1, arg2)
}

module.exports = get
