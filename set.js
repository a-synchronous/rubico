const setByPath = require('./_internal/setByPath')

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
 *   set('a.b', '1')({ a: { c : 2 }),
 * ) // { a : { b: 1, c: 2 }}
 * console.log(
 *   set('a[0].b.c', 4)({ 'a': [{ 'b': { 'c': 3 } }] }),
 * ) // { 'a': [{ 'b': { 'c': 4 } }] }
 *   console.log(set(['a', 'b'], '1')({ a: { c : 2 })),
 * ) // { a: { b: 1, c: 2 }}
 * ```
 */

const set = (path, value) => function setter(obj) {
  return setByPath(obj, value, path)
}

module.exports = set