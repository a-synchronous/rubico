const NextIteration = require('./NextIteration')
const isPromise = require('./isPromise')
const thunkConditional = require('./thunkConditional')
const thunkify1 = require('./thunkify1')
const __ = require('./placeholder')
const curry3 = require('./curry3')

/**
 * @name FilteringIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * filteringIterator = new FilteringIterator(
 *   iter Iterator<T>,
 *   predicate T=>boolean,
 * )
 *
 * filteringIterator.next() -> { value: any, done: boolean }
 * ```
const FilteringIterator = function (iter, predicate) {
  this.iter = iter
  this.predicate = predicate
}

FilteringIterator.prototype = {
  [symbolIterator]() {
    return this
  },
  next() {
    const thisIterNext = this.iter.next.bind(this.iter),
      thisPredicate = this.predicate
    let iteration = this.iter.next()

    while (!iteration.done) {
      const { value } = iteration
      if (thisPredicate(value)) {
        return { value, done: false }
      }
      iteration = thisIterNext()
    }
    return iteration
  },
} */

/**
 * @name FilteringIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * FilteringIterator<
 *   T any,
 *   iterator Iterator<T>,
 *   predicate T=>Promise|boolean,
 * >(iterator, predicate) -> filteringIterator Iterator<T>
 *
 * filteringIterator.next() -> { value: T, done: boolean }
 * ```
 *
 * @description
 * Creates a filtering iterator, i.e. an iterator that filteres a source iterator by predicate.
 */
const FilteringIterator = (iterator, predicate) => ({
  [symbolAsyncIterator]() {
    return this
  },
  [symbolIterator]() {
    return this
  },
  next() {
    let iteration = iterator.next()
    while(!iteration.done) {
      const { value } = iteration,
        predication = predicate(value)
      if (isPromise(predication)) {
        return predication.then(curry3(
          thunkConditional,
          __,
          thunkify1(NextIteration, value),
          this.next.bind(this)))
      } else if (predication) {
        return { value, done: false }
      }
      iteration = iterator.next()
    }
    return iteration
  },
})

module.exports = FilteringIterator
