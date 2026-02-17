/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
// (object Object, key string) -> boolean
const objectHas = function (object, key) {
  return object[key] != null
}


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

export default has
