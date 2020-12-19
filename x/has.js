// (object Object, key string) -> boolean
const objectHas = function (object, key) {
  return object[key] != null
}

/**
 * @name has
 *
 * @synopsis
 * ```coffeescript [specscript]
 * has(key any)(container Set|Map|{ has: function }|Object) -> Promise|boolean
 * ```
 */
const has = key => function hasKey(container) {
  if (container == null) {
    return false
  }
  if (typeof container.has == 'function') {
    return container.has(key)
  }
  if (container.constructor == Object) {
    return objectHas(container, key)
  }
  return false
}

module.exports = has
