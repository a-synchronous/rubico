const Instance = require('../monad/Instance')
const Struct = require('../monad/Struct')

const { isInstance, isArray, isObject } = Instance

const {
  isStruct,
  copy: structCopy,
  copyDeep: structCopyDeep,
  entries: structEntries,
} = Struct

/*
 * @synopsis
 * structDefaultsDeep(
 *   defaultCollection Array|Object,
 *   checkingFunc any=>boolean,
 *   x Array|Object,
 * ) -> y Array|Object
 */
const structDefaultsDeep = (defaultCollection, checkingFunc, x) => {
  if (!isStruct(defaultCollection)) return structCopyDeep(x)
  const y = structCopy(defaultCollection)
  for (const [index, value] of structEntries(x)) {
    const defaultValue = defaultCollection[index]
    y[index] = (isStruct(value)
      ? structDefaultsDeep(defaultValue, checkingFunc, value)
      : checkingFunc(value) ? value : defaultValue)
  }
  return y
}

/*
 * @name
 * defaultsDeep
 *
 * @synopsis
 * defaultsDeep(
 *   defaultCollection Array|Object,
 *   checkingFunc Optional<any=>boolean>,
 * )(x Promise<Array|Object>|Array|Object) -> deeplyDefaulted Array|Object
 *
 * @catchphrase
 * Deeply supply default values to an Object or Array
 *
 * @example
 * console.log(
 *   defaultsDeep({ a: 1 })({ b: 2, c: 3 }),
 * ) // { a: 1, b: 2, c: 3 }
 */
const defaultsDeep = (defaultCollection, checkingFunc = Instance.isInstance) => {
  if (!isStruct(defaultCollection)) {
    throw new TypeError([
      'defaultsDeep(defaultCollection)',
      'defaultCollection is not a Struct',
    ].join('; '))
  }
  return x => {
    if (isStruct(x)) {
      return structDefaultsDeep(defaultCollection, checkingFunc, x)
    }
    throw new TypeError('defaultsDeep(...)(x); x invalid')
  }
}

module.exports = defaultsDeep
