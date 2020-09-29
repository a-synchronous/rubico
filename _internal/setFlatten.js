const __ = require('./placeholder')
const curry3 = require('./curry3')
const identity = require('./identity')
const isPromise = require('./isPromise')
const isArray = require('./isArray')
const promiseAll = require('./promiseAll')
const asyncIteratorForEach = require('./asyncIteratorForEach')
const symbolIterator = require('./symbolIterator')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const callPropUnary = require('./callPropUnary')

/**
 * @name setFlatten
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream<T> = { read: ()=>T, write: T=>() }
 * Monad<T> = Array<T>|String<T>|Set<T>
 *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
 *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
 *
 * setFlatten<T>(
 *   set Set<Monad<T>|Foldable<T>|T>,
 * ) -> flattened Set<T>
 * ```
 */
const setFlatten = function (set) {
  const size = set.size,
    promises = [],
    result = new Set(),
    resultAddReducer = (_, subItem) => result.add(subItem),
    resultAdd = curry3(callPropUnary, result, 'add', __),
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
  return promises.length == 0 ? result : promiseAll(promises).then(getResult)
}

module.exports = setFlatten
