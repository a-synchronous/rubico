const isPromise = require('./isPromise')
const curry3 = require('./curry3')
const __ = require('./placeholder')
const callPropUnary = require('./callPropUnary')
const arrayMapPool = require('./arrayMapPool')

/**
 * @name stringMapPool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * stringMapPool(s string, concurrency number, f function) -> Promise|string
 * ```
 */
const stringMapPool = function (s, concurrency, f) {
  const result = arrayMapPool(s, concurrency, f)
  return isPromise(result)
    ? result.then(curry3(callPropUnary, __, 'join', ''))
    : result.join('')
}

module.exports = stringMapPool
