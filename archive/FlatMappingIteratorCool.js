/**
 * @name FlatMappingIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream<T> = { read: ()=>T, write: T=>() }
 * Monad<T> = Array<T>|String<T>|Set<T>
 *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
 *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>
 *   |{ reduce: Reducer<T>=>any }|Object<T>
 *
 * FlatMappingIterator<T>(
 *   iterator Iterator<Promise|T>
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * ) -> Iterator<Promise|T>
 * ```
 */
const FlatMappingIterator = function (iterator, flatMapper) {
  const buffer = [], promises = [],
    bufferPush = curry3(callPropUnary, buffer, 'push', __),
    bufferPushReducer = funcConcatSync(getArg1, bufferPush),
    flattenIntoBuffer = curryArgs3(genericReduce, __, bufferPushReducer, null),
    loadIntoBuffer = funcConcatSync(flattenIntoBuffer, tapSync(bufferLoading => {
      if (isPromise(bufferLoading)) {
        const promise = bufferLoading.then(() => promises.delete(promise))
        promises.add(promise)
      }
    }))
  let bufferIndex = Infinity
  return {
    [symbolAsyncIterator]() {
      return this
    },
    [symbolIterator]() {
      return this
    },

    _iterationStep(iteration) {
      if (iteration.done) {
        if (promises.size == 0) {
          return iteration
        }
        return promiseRace(promises).then(this.next.bind(this))
      }
      const monad = flatMapper(iteration.value),
        loadIntoBufferThenNext = funcConcatSync(
          loadIntoBuffer, this.next.bind(this))
      return isPromise(monad)
        ? monad.then(loadIntoBufferThenNext)
        : loadIntoBufferThenNext(monad)
    },

    next() {
      if (bufferIndex < buffer.length) {
        const value = buffer[bufferIndex]
        delete buffer[bufferIndex]
        bufferIndex += 1
        return { value, done: false }
      }
      const iteration = iterator.next()
      return isPromise(iteration)
        ? iteration.then(this._iterationStep.bind(this))
        : this._iterationStep(iteration)
    },
  }
}
