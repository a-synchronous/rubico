const funcConcat = require('./funcConcat')
const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const curry4 = require('./curry4')
const objectSet = require('./objectSet')

/**
 * @name asyncFunctionArrayAllSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncFunctionArrayAllSeries(
 *   funcs Array<function>,
 *   args Array,
 *   result Array,
 *   funcsIndex number
 * ) -> Promise|Array
 * ```
 *
 * @TODO benchmark vs regular promise handling
 */
const asyncFunctionArrayAllSeries = async function (funcs, args, result, funcsIndex) {
  const funcsLength = funcs.length
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    result[funcsIndex] = isPromise(resultItem) ? await resultItem : resultItem
  }
  return result
}

/**
 * @name functionArrayAllSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * functionArrayAllSeries(funcs Array<function>, args Array) -> Promise|Array
 * ```
 */
const functionArrayAllSeries = function (funcs, args) {
  const funcsLength = funcs.length, result = []
  let funcsIndex = -1
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(objectSet, result, funcsIndex, __),
        curry4(asyncFunctionArrayAllSeries, funcs, args, __, funcsIndex)))
    }
    result[funcsIndex] = resultItem
  }
  return result
}

module.exports = functionArrayAllSeries
