const NextIteration = require('./NextIteration')
const isPromise = require('./isPromise')
const symbolAsyncIterator = require('./symbolAsyncIterator')

/**
 * @name MappingAsyncIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mappingAsyncIterator = new MappingAsyncIterator(
 *   asyncIter AsyncIterator<T>,
 *   mapper T=>Promise|any,
 * ) -> mappingAsyncIterator AsyncIterator
 *
 * mappingAsyncIterator.next() -> Promise<{ value: any, done: boolean }>
 * ```
 */
const MappingAsyncIterator = (asyncIterator, mapper) => ({
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    const iteration = await asyncIterator.next()
    if (iteration.done) {
      return iteration
    }
    const mapped = mapper(iteration.value)
    return isPromise(mapped)
      ? mapped.then(NextIteration)
      : { value: mapped, done: false }
  }
})

module.exports = MappingAsyncIterator
