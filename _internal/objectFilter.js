const promiseAll = require('./promiseAll')
const isPromise = require('./isPromise')
const curry4 = require('./curry4')
const __ = require('./placeholder')
const always = require('./always')
const objectSetIf = require('./objectSetIf')

/**
 * @name objectFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectFilter<T>(
 *   object Object<T>,
 *   predicate T=>boolean,
 * ) -> result Object<T>
 * ```
 */
const objectFilter = function (object, predicate) {
  const result = {},
    promises = []
  for (const key in object) {
    const element = object[key],
      shouldIncludeElement = predicate(element, key, object)
    if (isPromise(shouldIncludeElement)) {
      promises.push(shouldIncludeElement.then(
        curry4(objectSetIf, result, key, object[key], __)))
    } else if (shouldIncludeElement) {
      result[key] = element
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

module.exports = objectFilter
