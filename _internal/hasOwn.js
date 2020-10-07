/**
 * @name hasOwn
 *
 * @synopsis
 * hasOwn(object any, key string) -> boolean
 *
 * @description
 * Determine whether a value is an array.
 */

const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (obj, key) => hasOwnProperty.call(obj, key)

module.exports = hasOwn
