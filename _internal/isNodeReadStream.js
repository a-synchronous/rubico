/**
 * @name isNodeReadStream
 *
 * @synopsis
 * isNodeReadStream(value any) -> boolean
 *
 * @description
 * Determine whether a value is a Node.js Readable Stream.
 */
const isNodeReadStream = value => value != null && typeof value.pipe == 'function'

module.exports = isNodeReadStream
