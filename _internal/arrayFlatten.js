const __ = require('./placeholder')
const curry3 = require('./curry3')
const getArg1 = require('./getArg1')
const identity = require('./identity')
const isArray = require('./isArray')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const callPropUnary = require('./callPropUnary')
const funcConcatSync = require('./funcConcatSync')
const asyncIteratorForEach = require('./asyncIteratorForEach')
const symbolIterator = require('./symbolIterator')
const symbolAsyncIterator = require('./symbolAsyncIterator')

/**
 * @name arrayFlatten
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
 * arrayFlatten<
 *   T any,
 *   array Array<Monad<T>|Foldable<T>|T>
 * >(array) -> Array<T>
 * ```
 */
const arrayFlatten = function (array) {
  const length = array.length,
    promises = [],
    result = [],
    getResult = () => result,
    resultPush = curry3(callPropUnary, result, 'push', __),
    resultPushReducer = funcConcatSync(getArg1, resultPush)
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
