/* rubico v1.5.0
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

'use strict'

const Instance = require('./Instance')

const { isArray, isObject, isSet, isMap } = Instance

/**
 * @synopsis
 * isStruct(x any) -> boolean
 */
const isStruct = x => isArray(x) || isObject(x) || isSet(x) || isMap(x)

/**
 * @name Struct
 *
 * @synopsis
 * new Struct(x Array|Object|Set|Map) -> Struct
 *
 * @catchphrase
 * Finite data structure
 */
const Struct = function(x) {
  if (!isStruct(x)) {
    throw new TypeError(`cannot convert ${x} to Struct`)
  }
  this.value = x
}

/**
 * @name Struct.isStruct
 *
 * @synopsis
 * Struct.isStruct(x any) -> boolean
 *
 * @catchphrase
 * Tell if struct
 */
Struct.isStruct = isStruct

/**
 * @synopsis
 * <T>objectEntriesGenerator(x Object<T>) -> Iterator<[key string, T]>
 */
const objectEntriesGenerator = function*(x) {
  for (const k in x) {
    yield [k, x[k]]
  }
}

/**
 * @name Struct.entries
 *
 * @synopsis
 * <T any>Struct.entries(x Array<T>) -> Iterator<[index number, T]>
 *
 * <T any>Struct.entries(x Object<T>) -> Iterator<[key string, T]>
 *
 * <T any>Struct.entries(x Set<T>) -> Iterator<[T, T]>
 *
 * <A any, B any>Struct.entries(x Map<A, B>) -> Iterator<[A, B]>
 *
 * @catchphrase
 * Get an iterator of key value pairs
 */
Struct.entries = x => isObject(x) ? objectEntriesGenerator(x) : x.entries()

/**
 * @synopsis
 * <T>objectValuesGenerator(x Object<T>) -> Iterator<T>
 */
const objectValuesGenerator = function*(x) {
  for (const k in x) {
    yield x[k]
  }
}

/**
 * @name Struct.values
 *
 * @synopsis
 * <T any>Struct.values(
 *   x Array<T>|Object<T>|Set<T>|Map<any, T>
 * ) -> Iterator<T>
 *
 * @catchphrase
 * Get an iterator of values
 */
Struct.values = x => isObject(x) ? objectValuesGenerator(x) : x.values()

/**
 * @name Struct.get
 *
 * @synopsis
 * <T any>Struct.get(x Array<T>, index number) -> T|undefined
 *
 * <T any>Struct.get(x Object<T>, index string) -> T|undefined
 *
 * <T any>Struct.get(x Set<T>, index T) -> T|undefined
 *
 * <A any, B any>Struct.get(x Map<A, B>, index A) -> B|undefined
 *
 * @catchphrase
 * Get an item by index
 */
Struct.get = (x, index) => {
  if (typeof x.get == 'function') return x.get(index)
  if (typeof x.has == 'function') return x.has(index) ? index : undefined
  return x[index]
}

/*
Struct.get.ternary = (x, index) => (typeof x.get == 'function'
  ? x.get(index) : typeof x.has == 'function'
  ? x.has(index) ? index : undefined : x[index])
*/

/**
 * @name Struct.set
 *
 * @synopsis
 * Struct.set(x Array, value any, index number) -> mutated Array
 *
 * Struct.set(x Object, value any, index string) -> mutated Object
 *
 * Struct.set(x Set, value any) -> mutated Set
 *
 * Struct.set(x Map, value any, index any) -> mutated Map
 *
 * @catchphrase
 * Set a value
 */
Struct.set = (x, value, index) => {
  if (typeof x.set == 'function') return x.set(index, value)
  if (typeof x.add == 'function') return x.add(value)
  x[index] = value
  return x
}

/**
 * @synopsis
 * objectKeysCount(obj object) -> ct number
 */
const objectKeysCount = obj => {
  let ct = 0
  for (const _ in obj) ct += 1
  return ct
}

/**
 * @name Struct.size
 *
 * @synopsis
 * Struct.size(x Array|Object|Set|Map) -> number
 *
 * @catchphrase
 * Count values
 */
Struct.size = x => {
  if (isObject(x)) return objectKeysCount(x)
  return 'size' in x ? x.size : x.length
}

/*
Struct.size.objectKeys = x => {
  if (isObject(x)) return Object.keys(x).length
  return 'size' in x ? x.size : x.length
}
*/

/**
 * @synopsis
 * copySet(x Set) -> y Set
 */
const copySet = x => {
  const y = new Set()
  for (const item of x) y.add(item)
  return y
}


/**
 * @synopsis
 * copyMap(x Map) -> y Map
 */
const copyMap = x => {
  const y = new Map()
  for (const entry of x) y.set(...entry)
  return y
}

/**
 * @name Struct.copy
 *
 * @synopsis
 * Struct.copy(x Array) -> copied Array
 *
 * Struct.copy(x Object) -> copied Object
 *
 * Struct.copy(x Set) -> copied Set
 *
 * Struct.copy(x Map) -> copied Map
 *
 * @catchphrase
 * Shallow copy a struct
 */
Struct.copy = x => {
  if (isArray(x)) return x.slice()
  if (isObject(x)) return { ...x }
  return isSet(x) ? copySet(x) : copyMap(x)
}

const { entries: structEntries, set: structSet } = Struct

/**
 * @name Struct.copyDeep
 *
 * @synopsis
 * Struct.copyDeep(x Array) -> deeplyCopied Array
 *
 * Struct.copyDeep(x Object) -> deeplyCopied Object
 *
 * Struct.copyDeep(x Set) -> deeplyCopied Set
 *
 * Struct.copyDeep(x Map) -> deeplyCopied Map
 *
 * @catchphrase
 * Deep copy a struct
 */
const structCopyDeep = x => {
  const y = new x.constructor()
  for (const [index, value] of structEntries(x)) {
    structSet(
      y,
      isStruct(value) ? structCopyDeep(value) : value,
      index,
    )
  }
  return y
}

Struct.copyDeep = structCopyDeep

module.exports = Struct
