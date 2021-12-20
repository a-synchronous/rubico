const isPromise = require('./isPromise')
const symbolAsyncIterator = require('./symbolAsyncIterator')

/**
 * @name FilteringAsyncIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * const filteringAsyncIterator = new FilteringAsyncIterator(
 *   asyncIterator AsyncIterator<T>,
 *   predicate T=>boolean,
 * ) -> FilteringAsyncIterator<T>
 *
 * filteringAsyncIterator.next() -> { value: Promise, done: boolean }
 * ```
 */
const FilteringAsyncIterator = (asyncIterator, predicate) => ({
  isAsyncIteratorDone: false,
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    while (!this.isAsyncIteratorDone) {
      const { value, done } = await asyncIterator.next()
      if (done) {
        this.isAsyncIteratorDone = true
      } else {
        const predication = predicate(value)
        if (isPromise(predication) ? await predication : predication) {
          return { value, done: false }
        }
      }
    }
    return { value: undefined, done: true }
  },
})

module.exports = FilteringAsyncIterator
