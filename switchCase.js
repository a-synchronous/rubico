const arrayConditional = require('./_internal/arrayConditional')
const areAllValuesNonfunctions = require('./_internal/areAllValuesNonfunctions')
const nonfunctionsConditional = require('./_internal/nonfunctionsConditional')

/**
 * @name switchCase
 *
 * @synopsis
 * ```coffeescript [specscript]
 * switchCase(conditionalFuncs Array<function>)(...args) -> Promise|any
 * ```
 *
 * @description
 * Conditional operator higher order function that accepts an array of conditional functions that specifies cases as pairings of `predicate` and `resolver` functions with the exception of the last, default resolver. All functions are provided with the same arguments and executed in series.
 *
 * ```javascript [playground]
 * const fruitIsYellow = fruit => fruit.color == 'yellow'
 *
 * const fruitsGuesser = switchCase([
 *   fruitIsYellow,
 *   fruit => fruit.name + ' is possibly a banana',
 *   fruit => fruit.name + ' is probably not a banana',
 * ])
 *
 * console.log(fruitsGuesser({ name: 'plantain', color: 'yellow' }))
 * // plantain is possibly a banana
 *
 * console.log(fruitsGuesser({ name: 'apple', color: 'red' }))
 * // apple is probably not a banana
 * ```
 *
 * For convenience, any function can be replaced with a nonfunction value (object or primitive value) in which case the value is treated as an already resolved value.
 *
 * ```javascript [playground]
 * switchCase([
 *   async function asyncIdentity(value) {
 *     return value
 *   },
 *   'something',
 *   'default',
 * ])(false).then(console.log) // default
 * ```
 *
 * @execution series
 */
const switchCase = values => {
  if (areAllValuesNonfunctions(values)) {
    return nonfunctionsConditional(values, -2)
  }
  return function switchingCases(...args) {
    return arrayConditional(values, args, -2)
  }
}

module.exports = switchCase
