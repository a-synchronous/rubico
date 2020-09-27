const thunkify1 = require('./thunkify1')
const isNodeReadStream = require('./isNodeReadStream')

/**
 * @name __streamWrite
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __streamWrite<
 *   chunk string|Buffer|Uint8Array|any,
 *   encoding string,
 *   callback function,
 *   stream { write: (chunk, encoding?, callback?)=>() }
 * >(stream)(chunk, encoding?, callback?) -> stream
 * ```
 */
const __streamWrite = stream => function appender(
  chunk, encoding, callback,
) {
  stream.write(chunk, encoding, callback)
  return stream
}

/**
 * @name _streamExtendExecutor
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream = { read: function, write: function }
 *
 * _streamExtendExecutor<
 *   resultStream Stream,
 *   stream Stream,
 *   resolve function,
 *   reject function,
 * >(resultStream, stream) -> executor (resolve, reject)=>()
 * ```
 *
 * @note optimizes function creation within _streamExtend
 */
const _streamExtendExecutor = (
  resultStream, stream,
) => function executor(resolve, reject) {
  stream.on('data', __streamWrite(resultStream))
  stream.on('end', thunkify1(resolve, resultStream))
  stream.on('error', reject)
}

/**
 * @name _streamExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream = { read: function, write: function }
 *
 * _streamExtend<
 *   resultStream Stream,
 *   stream Stream,
 * >(resultStream, stream) -> Promise<resultStream>
 * ```
 */
const _streamExtend = (
  resultStream, stream,
) => new Promise(_streamExtendExecutor(resultStream, stream))

/**
 * @name streamExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream = { read: function, write: function }
 *
 * streamExtend<
 *   stream Stream,
 *   values Stream|any,
 * >(stream, values) -> Promise|stream
 * ```
 *
 * @TODO maybe support `.read`
 */
const streamExtend = function (stream, values) {
  if (isNodeReadStream(values)) {
    return _streamExtend(stream, values)
  }
  stream.write(values)
  return stream
}

module.exports = streamExtend
