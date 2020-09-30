const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const always = require('./always')

/**
 * @name objectForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   object Object<T>,
 *   callback T=>()
 *
 * objectForEach(object, callback) -> ()
 * ```
 *
 * @description
 * Execute a callback for each value of an object. Return a promise if any executions are asynchronous.
 */
const objectForEach = function (object, callback) {
  const promises = []
  for (const key in object) {
    const operation = callback(object[key])
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? object : promiseAll(promises).then(always(object))
}

module.exports = objectForEach
