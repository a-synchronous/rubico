const SelfReferencingPromise = require('./SelfReferencingPromise')
const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')

/**
 * @name asyncIteratorSome
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncIteratorSome(
 *   iterator Iterator|AsyncIterator,
 *   predicate any=>Promise|boolean,
 *   index number,
 *   promises Set<Promise>,
 *   maxConcurrency number=20,
 * ) -> boolean
 * ```
 */
const asyncIteratorSome = async function (
  iterator, predicate, promises, maxConcurrency = 20,
) {
  let iteration = iterator.next()
  if (isPromise(iteration)) {
    iteration = await iteration
  }

  while (!iteration.done) {
    if (promises.size >= maxConcurrency) {
      const [predication, promise] = await promiseRace(promises)
      promises.delete(promise)
      if (predication) {
        return true
      }
    }
    const predication = predicate(iteration.value)
    if (isPromise(predication)) {
      promises.add(SelfReferencingPromise(predication))
    } else if (predication) {
      return true
    }
    iteration = iterator.next()
    if (isPromise(iteration)) {
      iteration = await iteration
    }
  }
  while (promises.size > 0) {
    const [predication, promise] = await promiseRace(promises)
    promises.delete(promise)
    if (predication) {
      return true
    }
  }
  return false
}

module.exports = asyncIteratorSome
