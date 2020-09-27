const isPromise = require('./isPromise')
const curry3 = require('./curry3')
const __ = require('./placeholder')
const arrayFilter = require('./arrayFilter')
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
 * Filter a string's characters by predicate.
 */
const stringFilter = function (string, predicate) {
  const filteredCharactersArray = arrayFilter(string, predicate)
  return isPromise(filteredCharactersArray)
    ? filteredCharactersArray.then(curry3(callPropUnary, __, 'join', ''))
    : filteredCharactersArray.join('')
}

module.exports = stringFilter
