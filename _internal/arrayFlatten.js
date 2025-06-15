const __ = require('./placeholder')
const arrayPush = require('./arrayPush')
const always = require('./always')
const curry2 = require('./curry2')
const getArg1 = require('./getArg1')
const identity = require('./identity')
const isArray = require('./isArray')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
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
    result = []
  let index = -1

  while (++index < length) {
    const element = array[index]
    if (isArray(element)) {
      const elementLength = element.length
      let elementIndex = -1
      while (++elementIndex < elementLength) {
        result.push(element[elementIndex])
      }
    } else if (element == null) {
      result.push(element)
    } else if (typeof element.then == 'function') {
      promises.push(element.then(curry2(arrayPush, result, __)))
    } else if (typeof element[symbolIterator] == 'function') {
      for (const subElement of element) {
        result.push(subElement)
      }
    } else if (typeof element[symbolAsyncIterator] == 'function') {
      promises.push(asyncIteratorForEach(
        element[symbolAsyncIterator](), curry2(arrayPush, result, __)))
    } else if (typeof element.chain == 'function') {
      const monadValue = element.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(curry2(arrayPush, result, __)))
        : result.push(monadValue)
    } else if (typeof element.flatMap == 'function') {
      const monadValue = element.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(curry2(arrayPush, result, __)))
        : result.push(monadValue)
    } else if (typeof element.reduce == 'function') {
      const folded = element.reduce(funcConcatSync(
        getArg1, curry2(arrayPush, result, __)), null)
      isPromise(folded) && promises.push(folded)
    } else if (element.constructor == Object) {
      for (const key in element) {
        result.push(element[key])
      }
    } else {
      result.push(element)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

module.exports = arrayFlatten
