const __ = require('./placeholder')
const curry2 = require('./curry2')
const isArray = require('./isArray')
const asyncIteratorForEach = require('./asyncIteratorForEach')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const always = require('./always')
const getArg1 = require('./getArg1')
const streamWrite = require('./streamWrite')
const funcConcatSync = require('./funcConcatSync')
const identity = require('./identity')
const symbolIterator = require('./symbolIterator')
const symbolAsyncIterator = require('./symbolAsyncIterator')

/**
 * @name streamFlatExtend
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
 * streamFlatExtend<T>(
 *   stream Stream<T>,
 *   element <Monad<T>|Foldable<T>|T>
 * ) -> stream
 * ```
 */
const streamFlatExtend = async function (stream, element) {
  const resultStreamWrite = curry2(streamWrite, stream, __),
    // resultStreamWriteReducer = (_, subElement) => stream.write(subElement),
    resultStreamWriteReducer = funcConcatSync(getArg1, resultStreamWrite),
    promises = []
  if (isArray(element)) {
    const elementLength = element.length
    let elementIndex = -1
    while (++elementIndex < elementLength) {
      stream.write(element[elementIndex])
    }
  } else if (element == null) {
    stream.write(element)
  } else if (typeof element[symbolIterator] == 'function') {
    for (const subElement of element) {
      stream.write(subElement)
    }
  } else if (typeof element[symbolAsyncIterator] == 'function') {
    promises.push(
      asyncIteratorForEach(element[symbolAsyncIterator](), resultStreamWrite))
  } else if (typeof element.chain == 'function') {
    const monadValue = element.chain(identity)
    isPromise(monadValue)
      ? promises.push(monadValue.then(resultStreamWrite))
      : stream.write(monadValue)
  } else if (typeof element.flatMap == 'function') {
    const monadValue = element.flatMap(identity)
    isPromise(monadValue)
      ? promises.push(monadValue.then(resultStreamWrite))
      : stream.write(monadValue)
  } else if (typeof element.reduce == 'function') {
    const folded = element.reduce(resultStreamWriteReducer, null)
    isPromise(folded) && promises.push(folded)
  } else if (element.constructor == Object) {
    for (const key in element) {
      stream.write(element[key])
    }
  } else {
    stream.write(element)
  }
  return promises.length == 0
    ? stream
    : promiseAll(promises).then(always(stream))
}

module.exports = streamFlatExtend
