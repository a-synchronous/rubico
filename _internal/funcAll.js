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
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[funcsIndex] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

module.exports = funcAll
