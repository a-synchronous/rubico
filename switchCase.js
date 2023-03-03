const arrayConditional = require('./_internal/arrayConditional')
const areAllValuesNonfunctions = require('./_internal/areAllValuesNonfunctions')
const nonfunctionsConditional = require('./_internal/nonfunctionsConditional')

/**
 * @name switchCase
 *
 * @synopsis
 * ```coffeescript [specscript]
 * switchCase(conditionalValues Array<boolean|any>) -> Promise|any
 *
 * switchCase(
 *   conditionalFuncsOrValues Array<function|boolean|any>
 * )(...args) -> Promise|any
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
 * Any function can be replaced with a nonfunction (object or primitive) value so that the value is treated as an already resolved value.
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
 * If every item in the conditional array is a nonfunction value, `switchCase` executes eagerly and behaves as the [Conditional (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).
 *
 * ```javascript [playground]
 * const age = 26
 *
 * const myDrink = switchCase([age >= 21, 'Beer', 'Juice'])
 *
 * console.log(myDrink) // Beer
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
