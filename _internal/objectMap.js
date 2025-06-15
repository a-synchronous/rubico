const isPromise = require('./isPromise')
const promiseObjectAll = require('./promiseObjectAll')

/**
 * @name objectMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectMap<
 *   T any,
 *   object Object<T>,
 *   mapper T=>Promise|any,
 * >(object, mapper) -> Promise|Object
 * ```
 *
 * @description
 * Apply a mapper concurrently to each value of an object, returning an object of results. Mapper may be asynchronous.
 */
const objectMap = function (object, mapper) {
  const result = {}
  let isAsync = false
  for (const key in object) {
    const resultElement = mapper(object[key], key, object)
    if (isPromise(resultElement)) {
      isAsync = true
    }
    result[key] = resultElement
  }
  return isAsync ? promiseObjectAll(result) : result
}

module.exports = objectMap
