const SelfReferencingPromise = require('./SelfReferencingPromise')
const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')

/**
 * @name asyncIteratorAny
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncIteratorAny(
 *   iterator Iterator|AsyncIterator,
 *   predicate any=>Promise|boolean,
 *   index number,
 *   promisesInFlight Set<Promise>,
 *   maxConcurrency number=20,
 * ) -> boolean
 * ```
 */
const asyncIteratorAny = async function (
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
      if (predication) {
        return true
      }
    }
    const predication = predicate(iteration.value)
    if (isPromise(predication)) {
      promisesInFlight.add(SelfReferencingPromise(predication))
    } else if (predication) {
      return true
    }
    iteration = iterator.next()
    if (isPromise(iteration)) {
      iteration = await iteration
    }
  }
  while (promisesInFlight.size > 0) {
    const [predication, promise] = await promiseRace(promisesInFlight)
    promisesInFlight.delete(promise)
    if (predication) {
      return true
    }
  }
  return false
}

module.exports = asyncIteratorAny
