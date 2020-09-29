const SelfReferencingPromise = require('./SelfReferencingPromise')
const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')

/**
 * @name asyncArrayAny
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncArrayAny(
 *   array Array,
 *   predicate any=>Promise|boolean,
 *   index number,
 *   promisesInFlight Set<Promise>,
 * ) -> boolean
 * ```
 */
const asyncArrayAny = async function (
  array, predicate, index, promisesInFlight,
) {
  const length = array.length

  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      promisesInFlight.add(SelfReferencingPromise(predication))
    } else if (predication) {
      return true
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

/**
 * @name arrayAny
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayAny(
 *   array Array,
 *   predicate any=>Promise|boolean,
 * ) -> boolean
 * ```
 */
const arrayAny = function (array, predicate) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      return asyncArrayAny(
        array, predicate, index, new Set([SelfReferencingPromise(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}

module.exports = arrayAny
