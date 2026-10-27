const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const always = require('./always')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const callPropUnary = require('./callPropUnary')

/**
 * @name setMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * setMap<
 *   T any,
 *   value Set<T>,
 *   mapper T=>Promise|any,
 *   context object
 * >(value, mapper, context) -> Promise|Set
 * ```
 *
 * @description
 * Apply a mapper concurrently to each element of a set, returning a set of results.
 */
const setMap = function (set, mapper, context) {
  const result = new Set(),
    promises = []
  for (const element of set) {
    const resultElement = mapper.call(context, element, element, set)
    if (isPromise(resultElement)) {
      promises.push(resultElement.then(curry3(callPropUnary, result, 'add', __)))
    } else {
      result.add(resultElement)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

module.exports = setMap
