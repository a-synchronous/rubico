const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

/**
 * @name objectToString
 *
 * @synopsis
 * objectToString(value any) -> string
 *
 * @description
 * Get the tag of an object
 */
const objectToString = value => nativeObjectToString.call(value)

module.exports = objectToString
