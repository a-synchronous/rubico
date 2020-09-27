/**
 * @name objectSet
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectSet(
 *   object Object,
 *   property string,
 *   value any,
 * ) -> object
 * ```
 */
const objectSet = function (object, property, value) {
  object[property] = value
  return object
}

module.exports = objectSet
