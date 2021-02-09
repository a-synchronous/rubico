const isPromise = require('./isPromise')
const genericReduce = require('./genericReduce')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const arrayPush = require('./arrayPush')
const curryArgs3 = require('./curryArgs3')
const __ = require('./placeholder')

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
      if (buffer.length > 0) {
        return { value: buffer.shift(), done: false }
      }
      const { value, done } = await asyncIterator.next()
      if (done) {
        while (promises.size > 0) {
          await new Promise(resolve => setTimeout(resolve, 25))
          if (buffer.length > 0) {
            return { value: buffer.shift(), done: false }
          }
        }
        return { value: undefined, done: true }
      }

      const monad = flatMapper(value)
      if (isPromise(monad)) {
        const bufferLoading = monad.then(
          curryArgs3(genericReduce, __, arrayPush, buffer))
        const promise = bufferLoading.then(() => promises.delete(promise))
        promises.add(promise)
      } else {
        const bufferLoading = genericReduce([monad], arrayPush, buffer)
        if (buffer.length > 0) {
          return { value: buffer.shift(), done: false }
        }
        if (isPromise(bufferLoading)) {
          const promise = bufferLoading.then(() => promises.delete(promise))
          promises.add(promise)
        }
      }

      while (promises.size > 0) {
        await new Promise(resolve => setTimeout(resolve, 25))
        if (buffer.length > 0) {
          return { value: buffer.shift(), done: false }
        }
      }
      return { value: undefined, done: true }
    },
  }
}

module.exports = FlatMappingAsyncIterator
