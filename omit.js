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
 * Create a new object by excluding specific keys.
 *
 * ```javascript [playground]
 * console.log(
 *   omit(['_id'])({ _id: '1', name: 'George' }),
 * ) // { name: 'George' }
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
