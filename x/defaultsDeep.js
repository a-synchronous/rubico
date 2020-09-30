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

// value any => boolean
const isDefined = value => value != null

/**
 * @name defaultsDeep
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var defaultCollection Array|Object,
 *   value Array|Object
 *
 * defaultsDeep(defaultCollection)(value) -> Array|Object
 * ```
 *
 * @description
 * Deeply provide an array or object with default values based on a default array or object.
 *
 * ```javascript [node]
 * const defaultsDeep = require('rubico/x/defaultsDeep')
 *
 * console.log(
 *   defaultsDeep({ a: 1 })({ b: 2, c: 3 }),
 * ) // { a: 1, b: 2, c: 3 }
 * ```
 */
const defaultsDeep = (
  defaultCollection, checkingFunc = isDefined,
) => function (value) {
  if (isStruct(value)) {
    return structDefaultsDeep(defaultCollection, checkingFunc, value)
  }
  return value
}

module.exports = defaultsDeep
