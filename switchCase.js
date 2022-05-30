const arrayConditional = require('./_internal/arrayConditional')
const areAllValuesNonfunctions = require('./_internal/areAllValuesNonfunctions')
const nonfunctionsConditional = require('./_internal/nonfunctionsConditional')

/**
 * @name switchCase
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   result any,
 *   predicate ...args=>Promise|boolean,
 *   resolver ...args=>Promise|result,
 *   defaultResolver ...args=>Promise|result,
 *   conditionalFunctions [
 *     ...Array<predicate|resolver>,
 *     defaultResolver,
 *   ]
 *
 * switchCase(conditionalFunctions)(...args) -> Promise|result
 * ```
 *
 * @description
 * Conditional operator with cases specified as pairings of `predicate` and `value`, with the exception of the last, default value. Any `predicate` or `value` can be a function, in which case it is evaluated against the point.
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
 * console.log(
 *   fruitsGuesser({ name: 'plantain', color: 'yellow' }),
 * ) // plantain is possibly a banana
 * ```
 *
 * A mixture of functions and nonfunctions can be supplied as any of the array items. Any Promises are resolved in series.
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
 * If every item in the argument array to switchCase is a value, switchCase should behave as the ternary ? : operator.
 *
 * ```javascript [playground]
 * const a = 1
 *
 * switchCase([
 *   a == 1,
 *   Promise.resolve('hello world'),
 *   'default',
 * ]).then(console.log) // hello world
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
