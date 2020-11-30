/**
 * @name omit
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var keys Array<string>,
 *   source Object
 *
 * omit(keys)(source) -> omitted Object
 * ```
 *
 * @description
 * Create a new object by excluding specific paths.
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
const omit = keys => function omitting(source) {
  if (source == null) {
    return source
  }
  const keysLength = keys.length,
    result = { ...source }
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    delete result[keys[keysIndex]]
  }
  return result
}

module.exports = omit
