const deleteByPath = require('./_internal/deleteByPath')
const copyDeep = require('./_internal/copyDeep')

/**
 * @name omit
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var paths Array<string>,
 *   source Object
 *
 * omit(paths)(source) -> omitted Object
 * ```
 *
 * @description
 * Create a new object by excluding specific paths on a source object.
 *
 * ```javascript [playground]
 * console.log(
 *   omit(['_id'])({ _id: '1', name: 'George' }),
 * ) // { name: 'George' }
 * ```
 *
 * Path patterns are the same as those supported by `get`:
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * console.log(
 *   omit(['a.b.d'])({
 *     a: {
 *       b: {
 *         c: 'hello',
 *         d: 'goodbye',
 *       },
 *     },
 *   }),
 * ) // { a: { b: { c: 'hello' } } }
 * ```
 */
const omit = paths => function omitting(source) {
  const pathsLength = paths.length,
    result = copyDeep(source)
  let pathsIndex = -1
  while (++pathsIndex < pathsLength) {
    deleteByPath(result, paths[pathsIndex])
  }
  return result
}

module.exports = omit
