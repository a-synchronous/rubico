const isPromise = require('./isPromise')
const genericReduce = require('./genericReduce')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const arrayPush = require('./arrayPush')
const promiseRace = require('./promiseRace')

/**
 * @name FlatMappingAsyncIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new FlatMappingAsyncIterator(
 *   asyncIterator AsyncIterator, flatMapper function,
 * ) -> FlatMappingAsyncIterator AsyncIterator
 * ```
 *
 * @execution concurrent
 *
 * @muxing
 */
const FlatMappingAsyncIterator = function (asyncIterator, flatMapper) {
  const buffer = [],
    promises = new Set()
  let bufferIndex = 0
  return {
    [symbolAsyncIterator]() {
      return this
    },
    toString() {
      return '[object FlatMappingAsyncIterator]'
    },

    /**
     * @name FlatMappingAsyncIterator.prototype.next
     *
     * @synopsis
     * ```coffeescript [specscript]
     * new FlatMappingAsyncIterator(
     *   asyncIterator AsyncIterator, flatMapper function,
     * ).next() -> Promise<{ value, done }>
     * ```
     *
     * @note
     * Promises
     * 1. asyncIterator.next() -> { value, done }
     * 2. flatMapper(value) -> monad
     * 3. flatten operation -> deferred promise set
     */
    async next() {
      if (bufferIndex < buffer.length) {
        const value = buffer[bufferIndex]
        delete buffer[bufferIndex]
        bufferIndex += 1
        return { value, done: false }
      }

      const iteration = await asyncIterator.next()
      if (iteration.done) {
        if (promises.size == 0) {
          return iteration
        }
        await promiseRace(promises)
        return this.next()
      }
      let monad = flatMapper(iteration.value)
      if (isPromise(monad)) {
        monad = await monad
      }
      // this will always load at least one item
      const bufferLoading = genericReduce([monad], arrayPush, buffer)
      if (isPromise(bufferLoading)) {
        const promise = bufferLoading.then(() => promises.delete(promise))
        promises.add(promise)
      }
      return this.next()
    },
  }
}

module.exports = FlatMappingAsyncIterator
