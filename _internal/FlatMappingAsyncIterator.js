const isPromise = require('./isPromise')
const genericReduce = require('./genericReduce')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const arrayPush = require('./arrayPush')
const curryArgs3 = require('./curryArgs3')
const __ = require('./placeholder')
const promiseAnyRejectOnce = require('./promiseAnyRejectOnce')

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
  let isAsyncIteratorDone = false

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
      while (!isAsyncIteratorDone || buffer.length > 0 || promises.size > 0) {
        const { value, done } = await asyncIterator.next()
        if (done) {
          isAsyncIteratorDone = done
        } else {
          const monad = flatMapper(value)
          if (isPromise(monad)) {
            const bufferLoading = monad.then(
            curryArgs3(genericReduce, __, arrayPush, buffer))
            const promise = bufferLoading.then(() => promises.delete(promise))
            promises.add(promise)
          } else {
            const bufferLoading = genericReduce([monad], arrayPush, buffer)
            if (isPromise(bufferLoading)) {
              const promise = bufferLoading.then(() => promises.delete(promise))
              promises.add(promise)
            }
          }
        }
        if (buffer.length > 0) {
          return { value: buffer.shift(), done: false }
        }
        if (promises.size > 0) {
          await promiseAnyRejectOnce(promises)
        }
      }
      return { value: undefined, done: true }
    },
  }
}

module.exports = FlatMappingAsyncIterator
