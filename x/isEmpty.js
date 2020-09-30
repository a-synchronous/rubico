const Instance = require('../monad/Instance')
const Struct = require('../monad/Struct')

const { isString } = Instance

const { isStruct, size: structSize } = Struct

/**
 * @name isEmpty
 *
 * @synopsis
 * isEmpty(x string|Array|Object) -> boolean
 *
 * @catchphrase
 * Check if a struct or string is empty
 *
 * @TODO refactor to _internal
 */
const isEmpty = function (value) {
  if (isString(value)) {
    return value.length == 0
  }
  if (isStruct(value)) {
    return structSize(value) == 0
  }
  return false
}

module.exports = isEmpty
