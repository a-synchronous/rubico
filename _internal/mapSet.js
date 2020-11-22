/**
 * @name mapSet
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapSet(source Map, key any, value any) -> source
 * ```
 */
const mapSet = function setting(source, key, value) {
  return source.set(key, value)
}

module.exports = mapSet
