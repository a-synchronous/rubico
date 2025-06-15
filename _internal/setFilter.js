const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const always = require('./always')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const thunkConditional = require('./thunkConditional')
const thunkify1 = require('./thunkify1')
const noop = require('./noop')

/**
 * @name setFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * setFilter<T>(
 *   set Set<T>,
 *   predicate T=>Promise|boolean,
 * ) -> filteredSet Promise|Set<T>
 * ```
 *
 * @description
 * Filter elements of a Set concurrently by predicate. `predicate` may be asynchronous.
 */
const setFilter = function (value, predicate) {
  const result = new Set(),
    resultAdd = result.add.bind(result),
    promises = []
  for (const element of value) {
    const predication = predicate(element, element, value)
    if (isPromise(predication)) {
      promises.push(predication.then(curry3(
        thunkConditional, __, thunkify1(resultAdd, element), noop)))
    } else if (predication) {
      result.add(element)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

module.exports = setFilter
