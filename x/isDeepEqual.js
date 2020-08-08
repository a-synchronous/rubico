const PossiblePromise = require('../monad/PossiblePromise')
const Instance = require('../monad/Instance')
const Struct = require('../monad/Struct')

const possiblePromiseArgs = PossiblePromise.args

const {
  isStruct,
  entries: structEntries,
  get: structGet,
} = Struct

/*
 * @synopsis
 * isSameStruct(a any, b any) -> boolean
 */
const isSameStruct = (a, b) => (isStruct(a) && isStruct(b)
  && a.constructor == b.constructor)

/*
 * @name isDeepEqual
 *
 * @synopsis
 * isDeepEqual(structA any, structB any) -> boolean
 *
 * @catchphrase
 * Checks if two values are deeply equal
 */
const isDeepEqual = (structA, structB) => {
  if (isSameStruct(structA, structB)) {
    for (const [index, value] of structEntries(structB)) {
      if (!isDeepEqual(structGet(structA, index), value)) return false
    }
    for (const [index, value] of structEntries(structA)) {
      if (!isDeepEqual(structGet(structB, index), value)) return false
    }
    return true
  }
  return structA === structB
}

module.exports = isDeepEqual
