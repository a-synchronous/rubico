const isPromise = require('./isPromise')
const promiseObjectAll = require('./promiseObjectAll')

/**
 * @name funcObjectAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcObjectAll(
 *   funcs Object<args=>Promise|any>
 * )(args ...any) -> objectAllFuncs ...args=>Promise|Object
 * ```
 *
 * @description
 * Concurrently execute the same arguments for each function of an object of functions, returning an object of results.
 */
const funcObjectAll = funcs => function objectAllFuncs(...args) {
  const result = {}
  let isAsync = false
  for (const key in funcs) {
    const resultItem = funcs[key](...args)
    if (isPromise(resultItem)) isAsync = true
    result[key] = resultItem
  }
  return isAsync ? promiseObjectAll(result) : result
}

module.exports = funcObjectAll
