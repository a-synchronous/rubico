/**
 * @name asyncIteratorForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncIteratorForEach(asyncIterator AsyncIterable, callback function) -> ()
 * ```
 */
const asyncIteratorForEach = async function (asyncIterator, callback) {
  for await (const item of asyncIterator) {
    callback(item)
  }
}

module.exports = asyncIteratorForEach
