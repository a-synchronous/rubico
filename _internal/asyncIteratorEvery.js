const SelfReferencingPromise = require('./SelfReferencingPromise')
const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')

/**
 * @name asyncIteratorEvery
 *
 * @synopsis
 * var T any,
 *   asyncIterator AsyncIterator<T>,
 *   predicate T=>Promise|boolean,
 *   promises Set<Promise<[T, Promise]>>,
 *   maxConcurrency number
 *
 * asyncIteratorEvery(
 *   asyncIterator, predicate, promises, maxConcurrency,
 * ) -> Promise<boolean>
 */
const asyncIteratorEvery = async function (
  asyncIterator, predicate, promises, maxConcurrency = 20,
) {
  let iteration = await asyncIterator.next()
  while (!iteration.done) {
    if (promises.size >= maxConcurrency) {
      const [predication, promise] = await promiseRace(promises)
      promises.delete(promise)
      if (!predication) {
        return false
      }
    }

    const predication = predicate(iteration.value)
    if (isPromise(predication)) {
      promises.add(SelfReferencingPromise(predication))
    } else if (!predication) {
      return false
    }
    iteration = await asyncIterator.next()
  }
  while (promises.size > 0) {
    const [predication, promise] = await promiseRace(promises)
    promises.delete(promise)
    if (!predication) {
      return false
    }
  }
  return true
}

module.exports = asyncIteratorEvery
