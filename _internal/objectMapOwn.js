const isPromise = require('./isPromise')
const promiseObjectAll = require('./promiseObjectAll')
const hasOwn = require('./hasOwn')

/**
 * @name objectMapOwn
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectMapOwn<
 *   T any,
 *   object Object<T>,
 *   mapper T=>Promise|any,
 * >(object, mapper) -> Promise|Object
 * ```
 *
 * @description
 * Apply a mapper concurrently to an object's own values, returning an object of results. Mapper may be asynchronous.
 * Guards mapping by validating that each property is the object's own and not inherited from the prototype chain.
 */
const objectMapOwn = function (object, mapper) {
  const result = {}
  let isAsync = false
  for (const key in object) {
    if (hasOwn(object, key)) {
      const resultItem = mapper(object[key])
      if (isPromise(resultItem)) {
        isAsync = true
      }
      result[key] = resultItem
    }
  }
  return isAsync ? promiseObjectAll(result) : result
}

module.exports = objectMapOwn
