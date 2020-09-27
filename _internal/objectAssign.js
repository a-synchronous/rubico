/**
 * @name objectAssign
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectAssign<
 *   target object, sourceObjects ...object,
 * >(target, ...sourceObjects) -> target
 * ```
 *
 * @description
 * `Object.assign` without the `.`
 */
const objectAssign = Object.assign

module.exports = objectAssign
