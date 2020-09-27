/**
 * @name objectAssign
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectAssign<
 *   targetObject Object, sourceObjects ...Object,
 * >(targetObject, ...sourceObjects) -> merged Object
 * ```
 *
 * @description
 * Dereferenced `Object.assign`
 */
const objectAssign = Object.assign

module.exports = objectAssign
