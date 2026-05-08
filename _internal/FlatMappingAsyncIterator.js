const isPromise = require('./isPromise')
const genericReduce = require('./genericReduce')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const arrayPush = require('./arrayPush')
const curry3 = require('./curry3')
const __ = require('./placeholder')
const promiseRace = require('./promiseRace')
const sleep = require('./sleep')

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
  const buffer = []
  const promises = new Set()

  let consumingAsyncIterator = false
  let isAsyncIteratorDone = false

  return {
    isAsyncIteratorDone: false,
    [symbolAsyncIterator]() {
      return this
    },
    toString() {
      return '[object FlatMappingAsyncIterator]'
    },

    // _consumeAsyncIterator() -> Promise<>
    async _consumeAsyncIterator() {
      for await (const item of asyncIterator) {
        const monad = flatMapper(item)
        if (isPromise(monad)) {
          const bufferLoading =
            monad.then(curry3(genericReduce, __, arrayPush, buffer))
          const promise = bufferLoading.then(() => promises.delete(promise))
          promises.add(promise)
        } else {
          const bufferLoading = genericReduce(monad, arrayPush, buffer)
          if (isPromise(bufferLoading)) {
            const promise = bufferLoading.then(() => promises.delete(promise))
            promises.add(promise)
          }
        }
      }
      isAsyncIteratorDone = true
    },

    /**
     * @name next
     *
     * @synopsis
     * ```coffeescript [specscript]
     * next() -> Promise<{ value, done }>
     * ```
     */
    async next() {
      if (!consumingAsyncIterator) {
        this._consumeAsyncIterator()
        consumingAsyncIterator = true
      }

      while (!isAsyncIteratorDone || promises.size > 0) {
        if (buffer.length > 0) {
          return { value: buffer.shift(), done: false }
        }
        if (promises.size > 0) {
          await promiseRace(promises)
        } else {
          await sleep(10)
        }
      }

      if (buffer.length > 0) {
        return { value: buffer.shift(), done: false }
      }

      return { value: undefined, done: true }
    },
  }
}

module.exports = FlatMappingAsyncIterator
