const isPromise = require('./isPromise')
const curry3 = require('./curry3')
const __ = require('./placeholder')
const arrayMap = require('./arrayMap')
const callPropUnary = require('./callPropUnary')

/**
 * @name stringMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * stringMap<
 *   character string,
 *   str String<character>,
 *   mapper character=>Promise|string|any,
 * >(str, mapper) -> stringWithCharactersMapped string
 * ```
 *
 * @description
 * Apply a mapper concurrently to each character of a string, returning a string result. `mapper` may be asynchronous.
 *
 * @related stringFlatMap
 */
const stringMap = function (string, mapper) {
  const result = arrayMap(string, mapper)
  return isPromise(result)
    ? result.then(curry3(callPropUnary, __, 'join', ''))
    : result.join('')
}

module.exports = stringMap
