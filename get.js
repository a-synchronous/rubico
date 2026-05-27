const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const curry3 = require('./_internal/curry3')
const funcApply = require('./_internal/funcApply')
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
 * type Path = string|number|Array<string|number>
 * type Resolver = any=>Promise|any
 *
 * get(object Promise|Object, path Path) -> result Promise|any
 * get(object Promise|Object, path Path, defaultValue any) -> result Promise|any
 * get(object Promise|Object, path Path, defaultResolver Resolver) -> result Promise|any
 *
 * get(path Path)(object Object) -> result Promise|any
 * get(path Path, defaultValue any)(object Object) -> result Promise|any
 * get(path Path, defaultResolver Resolver)(object Object) -> result Promise|any
 * ```
 *
 * @description
 * Property accessor. Accesses the property of an object given a path denoted by a string, number, or array of string or numbers.
 *
 * ```javascript [playground]
 * const obj = { hello: 'world' }
 *
 * const value = get(obj, 'hello')
 *
 * console.log(value)
 * ```
 *
 * `get` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * const obj = { hello: 'world' }
 *
 * const getHello = get('hello')
 *
 * const value = getHello({ hello: 'world' })
 *
 * console.log(value)
 * ```
 *
 * If the value denoted by the path is not found in the object, `get` returns a default value. The default value can be a function resolver that takes the object as an argument. If no default value is provided, `get` returns `undefined`.
 *
 * ```javascript [playground]
 * const getHelloWithDefaultValue = get('hello', 'default')
 *
 * console.log(getHelloWithDefaultValue({}))
 *
 * const getHelloWithDefaultResolver = get('hello', object => object.a)
 *
 * console.log(getHelloWithDefaultResolver({}))
 * ```
 *
 * The default resolver may be asynchronous, in which case `get` returns a promise.
 *
 * ```javascript [playground]
 * const asyncDefaultResolver = async object => object.a
 *
 * const result = await get({ a: 1 }, 'notfound', asyncDefaultResolver)
 *
 * console.log(result)
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
 * const abc0 = getABC0({ a: { b: { c: ['hello'] } } })
 *
 * console.log(abc0)
 *
 * const get00000DotNotation = get('0.0.0.0.0')
 * const get00000BracketNotation = get('[0][0][0][0][0]')
 * const get00000ArrayNotation = get([0, 0, 0, 0, 0])
 *
 * const nested = [[[[[1]]]]]
 *
 * console.log(get00000DotNotation(nested))
 * console.log(get00000BracketNotation(nested))
 * console.log(get00000ArrayNotation(nested))
 * ```
 *
 * If the argument object or default value is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * get(Promise.resolve({ a: 1 }), 'a').then(console.log)
 *
 * get({}, 'a', Promise.resolve('default-value')).then(console.log)
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
  if (isPromise(arg0) || isPromise(arg2)) {
    return promiseAll([arg0, arg1, arg2]).then(curry2(funcApply, _get, __))
  }
  return _get(arg0, arg1, arg2)
}

module.exports = get
