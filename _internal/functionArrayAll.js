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
    const f = funcs[funcsIndex]
    const resultElement = typeof f == 'function' ? f(...args) : f
    if (isPromise(resultElement)) {
      isAsync = true
    }
    result[funcsIndex] = resultElement
  }
  return isAsync ? promiseAll(result) : result
}

module.exports = functionArrayAll
