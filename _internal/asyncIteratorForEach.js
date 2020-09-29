/**
 * @name asyncIteratorForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncIteratorForEach(asyncIterator AsyncIterable, callback function) -> ()
 * ```
 *
 * @TODO convert all usages to iteratorForEach and handle promises there
 */
const asyncIteratorForEach = async function (asyncIterator, callback) {
  for await (const item of asyncIterator) {
    callback(item)
  }
}

module.exports = asyncIteratorForEach
