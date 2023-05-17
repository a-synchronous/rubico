const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')

/**
 * @name functionArrayAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * functionArrayAll(funcs Array<function>, args Array) -> Promise|Array
 * ```
 */
const functionArrayAll = function (funcs, args) {
  const funcsLength = funcs.length,
    result = Array(funcsLength)
  let funcsIndex = -1, isAsync = false
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[funcsIndex] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

module.exports = functionArrayAll
