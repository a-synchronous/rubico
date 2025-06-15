const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const callPropUnary = require('./callPropUnary')

/**
 * @name iteratorEvery
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorEvery(iterator Iterator, predicate ...any=>boolean) -> boolean
 * ```
 *
 * @TODO use .next() calls
 */
const iteratorEvery = function (iterator, predicate) {
  const promises = []
  for (const element of iterator) {
    const predication = predicate(element)
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

module.exports = iteratorEvery
