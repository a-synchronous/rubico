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
    resultAddReducer = (_, subElement) => result.add(subElement),
    resultAdd = curry3(callPropUnary, result, 'add', __),
    getResult = () => result

  for (const element of set) {
    if (isArray(element)) {
      const elementLength = element.length
      let elementIndex = -1
      while (++elementIndex < elementLength) {
        result.add(element[elementIndex])
      }
    } else if (element == null) {
      result.add(element)
    } else if (typeof element[symbolIterator] == 'function') {
      for (const subElement of element) {
        result.add(subElement)
      }
    } else if (typeof element[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(element[symbolAsyncIterator](), resultAdd))
    } else if (typeof element.chain == 'function') {
      const monadValue = element.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAdd))
        : result.add(monadValue)
    } else if (typeof element.flatMap == 'function') {
      const monadValue = element.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAdd))
        : result.add(monadValue)
    } else if (typeof element.reduce == 'function') {
      const folded = element.reduce(resultAddReducer, null)
      isPromise(folded) && promises.push(folded)
    } else if (element.constructor == Object) {
      for (const key in element) {
        result.add(element[key])
      }
    } else {
      result.add(element)
    }
  }
  return promises.length == 0 ? result : promiseAll(promises).then(getResult)
}

module.exports = setFlatten
