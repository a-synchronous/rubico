const Instance = require('./Instance')

const { isArray, isObject, isSet, isMap } = Instance

/*
 * @synopsis
 * isStruct(x any) -> boolean
 */
const isStruct = x => isArray(x) || isObject(x) || isSet(x) || isMap(x)

/*
 * @name Struct
 *
 * @synopsis
 * new Struct(x Array|Object|Set|Map) -> Struct
 *
 * @catchphrase
 * Generalized data structure
 */
const Struct = function(x) {
  if (!isStruct(x)) {
    throw new TypeError(`cannot convert ${x} to Struct`)
  }
  this.value = x
}

/*
 * @synopsis
 * Struct.isStruct(x any) -> boolean
 */
Struct.isStruct = isStruct

/*
 * @synopsis
 * <T>objectEntriesGenerator(x Object<T>) -> Iterator<[key string, T]>
 */
const objectEntriesGenerator = function*(x) {
  for (const k in x) {
    yield [k, x[k]]
  }
}

/*
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

/*
 * @synopsis
 * <T>objectValuesGenerator(x Object<T>) -> Iterator<T>
 */
const objectValuesGenerator = function*(x) {
  for (const k in x) {
    yield x[k]
  }
}

/*
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

/*
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

module.exports = Struct
