/**
 * @name objectGetFirstKey
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectGetFirstKey(object Object) -> firstKey string
 * ```
 */
const objectGetFirstKey = function (object) {
  for (const key in object) {
    return key
  }
  return undefined
}

module.exports = objectGetFirstKey
