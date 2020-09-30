const SelfReferencingPromise = require('./SelfReferencingPromise')
const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')

/**
 * @name asyncIteratorAll
 *
 * @synopsis
 * var T any,
 *   asyncIterator AsyncIterator<T>,
 *   predicate T=>Promise|boolean,
 *   promisesInFlight Set<Promise<[T, Promise]>>,
 *   maxConcurrency number
 *
 * asyncIteratorAll(
 *   asyncIterator, predicate, promisesInFlight, maxConcurrency,
 * ) -> Promise<boolean>
 */
const asyncIteratorAll = async function (
  iterator, predicate, promisesInFlight, maxConcurrency = 20,
) {
  let iteration = await iterator.next()
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

module.exports = asyncIteratorAll
