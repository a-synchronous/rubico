/**
 * @name isBinary
 *
 * @synopsis
 * isBinary(value any) -> boolean
 *
 * @description
 * Determine whether a value is binary. This could be `true` for `TypedArray` or a Node.js `Buffer`.
 */
const isBinary = ArrayBuffer.isView

module.exports = isBinary
