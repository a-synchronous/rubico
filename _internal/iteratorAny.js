const SelfReferencingPromise = require('./SelfReferencingPromise')
const asyncIteratorAny = require('./asyncIteratorAny')
const isPromise = require('./isPromise')

/**
 * @name iteratorAny
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorAny(
 *   iterator Iterator,
 *   predicate any=>Promise|boolean,
 * ) -> boolean
 * ```
 */
const iteratorAny = function (iterator, predicate) {
  for (const item of iterator) {
    const predication = predicate(item)
    if (isPromise(predication)) {
      return asyncIteratorAny(
        iterator, predicate, new Set([SelfReferencingPromise(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}

module.exports = iteratorAny
