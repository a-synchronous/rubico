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
 *   item <Monad<T>|Foldable<T>|T>
 * ) -> stream
 * ```
 */
const streamFlatExtend = async function (stream, item) {
  const resultStreamWrite = curry2(streamWrite, stream, __),
    // resultStreamWriteReducer = (_, subItem) => stream.write(subItem),
    resultStreamWriteReducer = funcConcatSync(getArg1, resultStreamWrite),
    promises = []
  if (isArray(item)) {
    const itemLength = item.length
    let itemIndex = -1
    while (++itemIndex < itemLength) {
      stream.write(item[itemIndex])
    }
  } else if (item == null) {
    stream.write(item)
  } else if (typeof item[symbolIterator] == 'function') {
    for (const subItem of item) {
      stream.write(subItem)
    }
  } else if (typeof item[symbolAsyncIterator] == 'function') {
    promises.push(
      asyncIteratorForEach(item[symbolAsyncIterator](), resultStreamWrite))
  } else if (typeof item.chain == 'function') {
    const monadValue = item.chain(identity)
    isPromise(monadValue)
      ? promises.push(monadValue.then(resultStreamWrite))
      : stream.write(monadValue)
  } else if (typeof item.flatMap == 'function') {
    const monadValue = item.flatMap(identity)
    isPromise(monadValue)
      ? promises.push(monadValue.then(resultStreamWrite))
      : stream.write(monadValue)
  } else if (typeof item.reduce == 'function') {
    const folded = item.reduce(resultStreamWriteReducer, null)
    isPromise(folded) && promises.push(folded)
  } else if (item.constructor == Object) {
    for (const key in item) {
      stream.write(item[key])
    }
  } else {
    stream.write(item)
  }
  return promises.length == 0
    ? stream
    : promiseAll(promises).then(always(stream))
}

module.exports = streamFlatExtend
