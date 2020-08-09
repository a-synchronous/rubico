const Instance = require('../monad/Instance')

const { isInstance, isArray, isObject } = Instance

/*
 * @synopsis
 * new Indexable(x Array|Object) -> Indexable
 *
 * @TODO migrate to rubico/monad/indexable.js
const Indexable = function(x) {
  if (!isIndexable(x)) {
    throw new TypeError('Indexable(x); x is not an Array or Object')
  }
  this.value = x
} */

const Indexable = {}

/*
 * @synopsis
 * Indexable.isIndexable(x any) -> boolean
 */
Indexable.isIndexable = x => isObject(x) || isArray(x)

/*
 * @synopsis
 * <T any>objectEntries(x Object<T>) -> Iterator<[key string, T]>
 */
const objectEntries = function*(x) {
  for (const k in x) yield [k, x[k]]
}

/*
 * @synopsis
 * <T any>new Indexable(x Array<T>).entries() -> Iterator<[i number, T]>
 *
 * <T any>new Indexable(x Object<T>).entries() -> Iterator<[key string, T]>
Indexable.prototype.entries = function() {
  return isObject(this.value) ? objectEntries(this.value) : this.value.entries()
} */

Indexable.entries = x => isObject(x) ? objectEntries(x) : x.entries()

const objectAssign = Object.assign

/*
 * @synopsis
 * Indexable.copy(x Array|Object) -> shallowlyCopied Array|Object
 */
Indexable.copy = x => isArray(x) ? x.slice(0) : objectAssign({}, x)

const jsonParse = JSON.parse

const jsonStringify = JSON.stringify

/*
 * @synopsis
 * Indexable.copyDeep(x Array|Object) -> deeplyCopied Array|Object
 *
 * @TODO support types beyond Primitives, Arrays, and Objects
 */
Indexable.copyDeep = x => jsonParse(jsonStringify(x))

const isIndexable = Indexable.isIndexable

const indexableCopyDeep = Indexable.copyDeep

const indexableCopy = Indexable.copy

const indexableEntries = Indexable.entries

/*
 * @synopsis
 * indexableDefaultsDeep(
 *   defaultCollection Array|Object,
 *   checkingFunc any=>boolean,
 *   x Array|Object,
 * ) -> y Array|Object
 */
const indexableDefaultsDeep = (defaultCollection, checkingFunc, x) => {
  if (!isIndexable(defaultCollection)) return indexableCopyDeep(x)
  const y = indexableCopy(defaultCollection)
  for (const [index, value] of indexableEntries(x)) {
    const xin = x[index], defaultValue = defaultCollection[index]
    y[index] = (isIndexable(value)
      ? indexableDefaultsDeep(defaultValue, checkingFunc, value)
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
 */
const defaultsDeep = (defaultCollection, checkingFunc = Instance.isInstance) => {
  if (!isIndexable(defaultCollection)) {
    throw new TypeError([
      'defaultsDeep(defaultCollection)',
      'defaultCollection is not an Array or Object',
    ].join('; '))
  }
  return x => {
    if (isIndexable(x)) {
      return indexableDefaultsDeep(defaultCollection, checkingFunc, x)
    }
    throw new TypeError('defaultsDeep(...)(x); x invalid')
  }
}

module.exports = defaultsDeep
