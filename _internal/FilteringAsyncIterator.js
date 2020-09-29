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
const FilteringAsyncIterator = (iter, predicate) => ({
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    let iteration = await iter.next()

    while (!iteration.done) {
      const { value } = iteration,
        predication = predicate(value)
      if (isPromise(predication) ? await predication : predication) {
        return { value, done: false }
      }
      iteration = await iter.next()
    }
    return iteration
  },
})

module.exports = FilteringAsyncIterator
