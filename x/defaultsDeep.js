const { or } = require('..')
const PossiblePromise = require('../monad/possible-promise')
const isObject = require('./isObject')
const is = require('./is')

const isDefined = x => typeof x !== 'undefined' && x !== null

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
Indexable.isIndexable = x => isObject(x) || Array.isArray(x)

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

/*
 * @synopsis
 * Indexable.copy(x Array|Object) -> shallowlyCopied Array|Object
 */
Indexable.copy = x => Array.isArray(x) ? x.slice(0) : Object.assign({}, x)

/*
 * @synopsis
 * defaultsDeepIndexable(
 *   defaultCollection Array|Object,
 *   checkingFunc any=>boolean,
 *   x Array|Object,
 * ) -> y Array|Object
 */
const defaultsDeepIndexable = (defaultCollection, checkingFunc, x) => {
  const y = Indexable.copy(defaultCollection)
  for (const [index, value] of Indexable.entries(x)) {
    const xin = x[index], defaultValue = defaultCollection[index]
    y[index] = (Indexable.isIndexable(value)
      ? defaultsDeepIndexable(defaultValue, checkingFunc, value)
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
const defaultsDeep = (defaultCollection, checkingFunc = isDefined) => {
  if (!Indexable.isIndexable(defaultCollection)) {
    throw new TypeError([
      'defaultsDeep(defaultCollection)',
      'defaultCollection is not an Array or Object',
    ].join('; '))
  }
  return PossiblePromise.args(x => {
    if (Indexable.isIndexable(x)) {
      return defaultsDeepIndexable(defaultCollection, checkingFunc, x)
    }
    throw new TypeError('defaultsDeep(...)(x); x invalid')
  })
}

module.exports = defaultsDeep
