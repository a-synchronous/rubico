/**
 * @name arrayPush
 *
 * @synopsis
 * arrayPush(
 *   array Array,
 *   value any
 * ) -> array
 */
const arrayPush = function (array, value) {
  array.push(value)
  return array
}

module.exports = arrayPush
