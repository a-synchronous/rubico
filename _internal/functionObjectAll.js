const always = require('./always')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const objectSet = require('./objectSet')

/**
 * @name functionObjectAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * functionObjectAll(funcs Array<function>, args Array) -> Promise|Object
 * ```
 *
 * @description
 * Concurrently execute the same arguments for each function of an object of functions, returning an object of results.
 */
const functionObjectAll = function (funcs, args) {
  const result = {}, promises = []
  for (const key in funcs) {
    const resultItem = funcs[key](...args)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(curry3(objectSet, result, key, __)))
    } else {
      result[key] = resultItem
    }
  }
  return promises.length == 0 ? result : promiseAll(promises).then(always(result))
}

module.exports = functionObjectAll
