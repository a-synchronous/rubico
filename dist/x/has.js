/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, has) {
  if (typeof module == 'object') (module.exports = has) // CommonJS
  else if (typeof define == 'function') define(() => has) // AMD
  else (root.has = has) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'
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

return has
}())))
