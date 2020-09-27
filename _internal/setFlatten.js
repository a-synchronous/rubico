const __ = require('./placeholder')
const curry2 = require('./curry2')
const asyncIteratorForEach = require('./asyncIteratorForEach')

const identity = value => value
const isPromise = value => value != null && typeof value.then == 'function'
const isArray = Array.isArray
const symbolIterator = Symbol.iterator
const symbolAsyncIterator = Symbol.asyncIterator
const promiseAll = Promise.all.bind(Promise)
const setAdd = (set, item) => set.add(item)

/**
 * @name setFlatten
 *
 * @synopsis
 * ```coffeescript [specscript]
 * setFlatten(set Set<Monad|Foldable|any>) -> Set
 * ```
 */
const setFlatten = function (set) {
  const size = set.size,
    promises = [],
    result = new Set(),
    resultAddReducer = (_, subItem) => result.add(subItem),
    resultAdd = curry2(setAdd, result, __),
    getResult = () => result

  for (const item of set) {
    if (isArray(item)) {
      const itemLength = item.length
      let itemIndex = -1
      while (++itemIndex < itemLength) {
        result.add(item[itemIndex])
      }
    } else if (item == null) {
      result.add(item)
    } else if (typeof item[symbolIterator] == 'function') {
      for (const subItem of item) {
        result.add(subItem)
      }
    } else if (typeof item[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(item[symbolAsyncIterator](), resultAdd))
    } else if (typeof item.chain == 'function') {
      const monadValue = item.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAdd))
        : result.add(monadValue)
    } else if (typeof item.flatMap == 'function') {
      const monadValue = item.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAdd))
        : result.add(monadValue)
    } else if (typeof item.reduce == 'function') {
      const folded = item.reduce(resultAddReducer, null)
      isPromise(folded) && promises.push(folded)
    } else if (item.constructor == Object) {
      for (const key in item) {
        result.add(item[key])
      }
    } else {
      result.add(item)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

module.exports = setFlatten
