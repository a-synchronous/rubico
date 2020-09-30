/**
 * @name asyncIteratorToArray
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   asyncIterator AsyncIterator<T>
 *
 * asyncIteratorToArray(asyncIterator) -> Array<T>
 * ```
 *
 * @description
 * Convert an async iterator to an array.
 *
 * Note: async iterator is consumed
 */
const asyncIteratorToArray = async function (asyncIterator) {
  const result = []
  for await (const item of asyncIterator) {
    result.push(item)
  }
  return result
}

module.exports = asyncIteratorToArray
