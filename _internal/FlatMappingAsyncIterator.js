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
  let isAsyncIteratorDone = false;

  (async function () {
    for await (const item of asyncIterator) {
      let monad = flatMapper(item)
      if (isPromise(monad)) {
        monad = await monad
      }
      // this will always load at least one item
      const bufferLoading = genericReduce([monad], arrayPush, buffer)
      if (isPromise(bufferLoading)) {
        const promise = bufferLoading.then(() => promises.delete(promise))
        promises.add(promise)
      }
    }
    isAsyncIteratorDone = true
  })()

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
     */
    async next() {
      while (buffer.length == 0) {
        if (isAsyncIteratorDone && promises.size == 0) {
          return { value: undefined, done: true }
        }
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      return { value: buffer.shift(), done: false }
    },
  }
}

module.exports = FlatMappingAsyncIterator
