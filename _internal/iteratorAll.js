const SelfReferencingPromise = require('./SelfReferencingPromise')
const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')
const promiseAll = require('./promiseAll')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const callPropUnary = require('./callPropUnary')
const symbolIterator = require('./symbolIterator')

/**
 * @name _asyncIteratorAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _asyncIteratorAll(asyncIterator AsyncIterator, predicate ...any=>boolean) -> boolean
 * ```
 *
 * @related asyncIteratorAny
 */
const _asyncIteratorAll = async function (
  iterator, predicate, promisesInFlight, maxConcurrency = 20,
) {
  let iteration = iterator.next()
  if (isPromise(iteration)) {
    iteration = await iteration
  }

  while (!iteration.done) {
    if (promisesInFlight.size >= maxConcurrency) {
      const [predication, promise] = await promiseRace(promisesInFlight)
      promisesInFlight.delete(promise)
      if (!predication) {
        return false
      }
    }
    const predication = predicate(iteration.value)
    if (isPromise(predication)) {
      promisesInFlight.add(SelfReferencingPromise(predication))
    } else if (!predication) {
      return false
    }
    iteration = iterator.next()
    if (isPromise(iteration)) {
      iteration = await iteration
    }
  }
  while (promisesInFlight.size > 0) {
    const [predication, promise] = await promiseRace(promisesInFlight)
    promisesInFlight.delete(promise)
    if (!predication) {
      return false
    }
  }
  return true
}

/**
 * @name iteratorAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorAll(iterator Iterator, predicate ...any=>boolean) -> boolean
 * ```
 *
 * @TODO use .next() calls
 */
const iteratorAll = function (iterator, predicate) {
  if (typeof iterator[symbolIterator] == 'function') {
    const promises = []
    for (const item of iterator) {
      const predication = predicate(item)
      if (isPromise(predication)) {
        promises.push(predication)
      } else if (!predication) {
        return false
      }
    }
    return promises.length == 0
      ? true
      : promiseAll(promises).then(curry3(callPropUnary, __, 'every', Boolean))
  }
  return _asyncIteratorAll(iterator, predicate, new Set())
}

module.exports = iteratorAll
