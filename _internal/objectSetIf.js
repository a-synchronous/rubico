/**
 * @name objectSetIf
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectSetIf<
 *   object Object,
 *   key string,
 *   value any,
 *   condition boolean,
 * >(object, key, value, condition) -> object
 * ```
 */
const objectSetIf = function (
  object, key, value, condition,
) {
  if (condition) {
    object[key] = value
  }
}

module.exports = objectSetIf
