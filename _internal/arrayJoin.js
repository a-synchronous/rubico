/**
 * @name arrayJoin
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayJoin(array Array, delimiter string) -> string
 * ```
 *
 * @description
 * Call `.join` on an array.
 */
const arrayJoin = (array, delimiter) => array.join(delimiter)

module.exports = arrayJoin
