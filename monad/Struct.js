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
 * @synopsis
 * Struct.isStruct(x any) -> boolean
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

module.exports = Struct
