const Instance = require('../monad/Instance')
const Struct = require('../monad/Struct')

const { isString } = Instance

const { isStruct, size: structSize } = Struct

/**
 * @name isEmpty
 *
 * @synopsis
 * isEmpty(x string|Array|Object|Set|Map) -> boolean
 *
 * @catchphrase
 * Check if a struct or string is empty
 */
const isEmpty = x => {
  if (isString(x)) return x.length == 0
  if (isStruct(x)) return structSize(x) == 0
  throw new TypeError('isEmpty(x); x invalid')
}

module.exports = isEmpty
