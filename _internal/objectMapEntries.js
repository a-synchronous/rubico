const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const objectSet = require('./objectSet')
const curryArity = require('./curryArity')
const spread2 = require('./spread2')
const always = require('./always')

/**
 * @name objectMapEntries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectMapEntries(
 *   object Object,
 *   mapper ([key string, value any])=>Promise|[string, any],
 * ) -> Promise|Object
 * ```
 */
const objectMapEntries = function (object, mapper) {
  const result = {},
    promises = []
  for (const key in object) {
    const value = object[key],
      mapping = mapper([key, value])
    if (isPromise(mapping)) {
      promises.push(mapping.then(
        spread2(curryArity(3, objectSet, [result]))))
    } else {
      result[mapping[0]] = mapping[1]
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

module.exports = objectMapEntries
