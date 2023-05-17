const SelfReferencingPromise = require('./SelfReferencingPromise')
const asyncIteratorSome = require('./asyncIteratorSome')
const isPromise = require('./isPromise')

/**
 * @name iteratorSome
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorSome(
 *   iterator Iterator,
 *   predicate any=>Promise|boolean,
 * ) -> boolean
 * ```
 */
const iteratorSome = function (iterator, predicate) {
  for (const item of iterator) {
    const predication = predicate(item)
    if (isPromise(predication)) {
      return asyncIteratorSome(
        iterator, predicate, new Set([SelfReferencingPromise(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}

module.exports = iteratorSome
