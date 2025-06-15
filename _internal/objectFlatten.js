const __ = require('./placeholder')
const curry2 = require('./curry2')
const getArg1 = require('./getArg1')
const identity = require('./identity')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const objectAssign = require('./objectAssign')
const funcConcatSync = require('./funcConcatSync')
const asyncIteratorForEach = require('./asyncIteratorForEach')
const symbolIterator = require('./symbolIterator')
const symbolAsyncIterator = require('./symbolAsyncIterator')

/**
 * @name objectFlatten
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
 * objectFlatten<T>(
 *   object Object<Monad<T>|Foldable<T>|T>,
 * ) -> Object<T>
 * ```
 *
 * @TODO change objectAssign to objectDeepAssign
 */
const objectFlatten = function (object) {
  const promises = [],
    result = {},
    resultAssign = curry2(objectAssign, result, __),
    resultAssignReducer = funcConcatSync(getArg1, resultAssign),
    getResult = () => result

  for (const key in object) {
    const element = object[key]
    if (element == null) {
      continue
    } else if (typeof element[symbolIterator] == 'function') {
      for (const monadElement of element) {
        objectAssign(result, monadElement)
      }
    } else if (typeof element[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(element[symbolAsyncIterator](), resultAssign))
    } else if (typeof element.chain == 'function') {
      const monadValue = element.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAssign))
        : objectAssign(result, monadValue)
    } else if (typeof element.flatMap == 'function') {
      const monadValue = element.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAssign))
        : resultAssign(monadValue)
    } else if (typeof element.reduce == 'function') {
      const folded = element.reduce(resultAssignReducer, null)
      isPromise(folded) && promises.push(folded)
    } else {
      objectAssign(result, element)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

module.exports = objectFlatten
