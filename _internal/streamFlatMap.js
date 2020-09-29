const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const streamFlatExtend = require('./streamFlatExtend')
const promiseAll = require('./promiseAll')

/**
 * @name streamFlatMap
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
 * streamFlatMap<T>(
 *   stream Stream<T>,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * ) -> Promise|Stream<T>
 * ```
 */
const streamFlatMap = async function (stream, flatMapper) {
  const promises = new Set()
  for await (const item of stream) {
    const monad = flatMapper(item)
    if (isPromise(monad)) {
      const selfDeletingPromise = monad.then(
        curry2(streamFlatExtend, stream, __)).then(
          () => promises.delete(selfDeletingPromise))
      promises.add(selfDeletingPromise)
    } else {
      const streamFlatteningOperation = streamFlatExtend(stream, monad)
      if (isPromise(streamFlatteningOperation)) {
        const selfDeletingPromise = streamFlatteningOperation.then(
          () => promises.delete(selfDeletingPromise))
        promises.add(selfDeletingPromise)
      }
    }
  }
  await promiseAll(promises)
  return stream
}

module.exports = streamFlatMap
