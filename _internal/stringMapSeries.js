const isPromise = require('./isPromise')
const curry3 = require('./curry3')
const __ = require('./placeholder')
const arrayMapSeries = require('./arrayMapSeries')
const callPropUnary = require('./callPropUnary')

/**
 * @name stringMapSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * stringMapSeries<
 *   character string,
 *   str String<character>,
 *   mapper character=>Promise|string|any,
 * >(str, mapper) -> stringWithCharactersMapped string
 * ```
 *
 * @description
 * Apply a mapper function in series to each character of a string, returning a string result. mapper function may be asynchronous.
 *
 * @related stringFlatMap
 */
const stringMapSeries = function (string, mapper) {
  const result = arrayMapSeries(string, mapper)
  return isPromise(result)
    ? result.then(curry3(callPropUnary, __, 'join', ''))
    : result.join('')
}

module.exports = stringMapSeries
