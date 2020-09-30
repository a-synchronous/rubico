const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const callPropUnary = require('./callPropUnary')

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

module.exports = iteratorAll
