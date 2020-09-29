const curry3 = require('./curry3')
const __ = require('./placeholder')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const callPropUnary = require('./callPropUnary')

/**
 * @name arrayAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayAll(array Array, predicate ...any=>boolean) -> boolean
 * ```
 */
const arrayAll = function (array, predicate) {
  const arrayLength = array.length,
    promises = []
  let index = -1
  while (++index < arrayLength) {
    const predication = predicate(array[index])
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

module.exports = arrayAll
