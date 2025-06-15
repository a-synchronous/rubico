const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')

/**
 * @name funcAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcAll<args ...any>(
 *   funcs Array<args=>Promise|any>
 * ) -> allFuncs args=>Promise|Array
 * ```
 */
const funcAll = funcs => function allFuncs(...args) {
  const funcsLength = funcs.length,
    result = Array(funcsLength)
  let funcsIndex = -1, isAsync = false
  while (++funcsIndex < funcsLength) {
    const resultElement = funcs[funcsIndex](...args)
    if (isPromise(resultElement)) {
      isAsync = true
    }
    result[funcsIndex] = resultElement
  }
  return isAsync ? promiseAll(result) : result
}

module.exports = funcAll
