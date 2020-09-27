const __ = require('./placeholder')
const curry2 = require('./curry2')
const asyncIteratorForEach = require('./asyncIteratorForEach')

const identity = value => value
const isPromise = value => value != null && typeof value.then == 'function'
const isArray = Array.isArray
const symbolIterator = Symbol.iterator
const symbolAsyncIterator = Symbol.asyncIterator
const promiseAll = Promise.all.bind(Promise)
const arrayPush = (array, item) => array.push(item)

/**
 * @name arrayFlatten
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * arrayFlatten(array Array<Monad|Foldable|any>) -> Array
 * ```
 *
 * @related genericReduceConcurrent
 */
const arrayFlatten = function (array) {
  const length = array.length,
    promises = [],
    result = [],
    resultPushReducer = (_, subItem) => result.push(subItem),
    resultPush = curry2(arrayPush, result, __),
    getResult = () => result
  let index = -1

  while (++index < length) {
    const item = array[index]
    if (isArray(item)) {
      const itemLength = item.length
      let itemIndex = -1
      while (++itemIndex < itemLength) {
        result.push(item[itemIndex])
      }
    } else if (item == null) {
      result.push(item)
    } else if (typeof item[symbolIterator] == 'function') {
      for (const subItem of item) {
        result.push(subItem)
      }
    } else if (typeof item[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(item[symbolAsyncIterator](), resultPush))
    } else if (typeof item.chain == 'function') {
      const monadValue = item.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultPush))
        : result.push(monadValue)
    } else if (typeof item.flatMap == 'function') {
      const monadValue = item.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultPush))
        : result.push(monadValue)
    } else if (typeof item.reduce == 'function') {
      const folded = item.reduce(resultPushReducer, null)
      isPromise(folded) && promises.push(folded)
    } else if (item.constructor == Object) {
      for (const key in item) {
        result.push(item[key])
      }
    } else {
      result.push(item)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

module.exports = arrayFlatten
