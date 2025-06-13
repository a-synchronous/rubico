const funcConcat = require('../_internal/funcConcat')
const map = require('../map')
const get = require('../get')

/**
 * @name pluck
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pluck(path string)(array Array) -> result Array
 *
 * pluck(array Array, path string) -> result Array
 * ```
 *
 * @description
 * Creates an array of picked properties denoted by a path from another array.
 *
 * `pluck` supports three types of path patterns for nested property access.
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * import pluck from 'https://unpkg.com/rubico/dist/x/pluck.es.js'
 *
 * const users = [
 *   { name: 'John', age: 33 },
 *   { name: 'Jane', age: 51 },
 *   { name: 'Jim', age: 22 },
 * ]
 *
 * const usernames = pluck(users, 'name')
 *
 * console.log(usernames) // ['John', 'Jane', 'Jim']
 * ```
 */
const pluck = function (...args) {
  const path = args.pop()
  const getter = get(path)
  if (args.length == 0) {
    return map(getter)
  }
  return map(args[0], getter)
}

module.exports = pluck
