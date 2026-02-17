const SelfReferencingPromise = require('./SelfReferencingPromise')
const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')

/**
 * @name asyncArraySome
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncArraySome(
 *   array Array,
 *   predicate any=>Promise|boolean,
 *   index number,
 *   promises Set<Promise>,
 * ) -> boolean
 * ```
 */
const asyncArraySome = async function (
  array, predicate, index, promises,
) {
  const length = array.length

  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      promises.add(SelfReferencingPromise(predication))
    } else if (predication) {
      return true
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

/**
 * @name arraySome
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arraySome(
 *   array Array,
 *   predicate any=>Promise|boolean,
 * ) -> boolean
 * ```
 */
const arraySome = function (array, predicate) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      return asyncArraySome(
        array, predicate, index, new Set([SelfReferencingPromise(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}

module.exports = arraySome
