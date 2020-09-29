/**
 * @name objectValuesGenerator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectValuesGenerator(object Object<T>) -> Generator<T>
 * ```
 */
const objectValuesGenerator = function* (object) {
  for (const key in object) {
    yield object[key]
  }
}
