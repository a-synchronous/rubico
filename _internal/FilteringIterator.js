const symbolIterator = require('./symbolIterator')

/**
 * @name FilteringIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * FilteringIterator<
 *   T any,
 *   iterator Iterator<T>,
 *   predicate T=>boolean, # no async
 * >(iterator, predicate) -> filteringIterator Iterator<T>
 *
 * filteringIterator.next() -> { value: T, done: boolean }
 * ```
 *
 * @description
 * Creates a filtering iterator, i.e. an iterator that filteres a source iterator by predicate.
 */
const FilteringIterator = (iterator, predicate) => ({
  [symbolIterator]() {
    return this
  },
  next() {
    let iteration = iterator.next()
    while (!iteration.done) {
      const { value } = iteration
      if (predicate(value)) {
        return { value, done: false }
      }
      iteration = iterator.next()
    }
    return iteration
  },
})

module.exports = FilteringIterator
