/**
 * @name streamWrite
 *
 * @synopsis
 * ```coffeescript [specscript]
 * streamWrite(
 *   stream Writable,
 *   chunk string|Buffer|Uint8Array|any,
 *   encoding string|undefined,
 *   callback function|undefined,
 * ) -> stream
 * ```
 *
 * @description
 * Call `.write` on a Node.js stream
 */
const streamWrite = function (stream, chunk, encoding, callback) {
  stream.write(chunk, encoding, callback)
  return stream
}

module.exports = streamWrite
