const funcsOrValuesConditional = require('./_internal/funcsOrValuesConditional')
const areFuncsOrValuesAllValues = require('./_internal/areFuncsOrValuesAllValues')
const arrayConditional = require('./_internal/arrayConditional')

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
 * Conditional operator for values or functions. Cases are defined as pairings of `predicate` and `value` (or `resolver` thereof), with the exception of the last, default resolver or value.
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
 * A mixture of possibly async functions and values can be supplied as any of the array items.
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
 * If every item in the argument array to switchCase is a value, switchCase should behave as the ternary ? : operator. Any promises are resolved serially.
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
const switchCase = funcsOrValues => {
  if (areFuncsOrValuesAllValues(funcsOrValues)) {
    return arrayConditional(funcsOrValues, -2)
  }
  return function switchingCases(...args) {
    return funcsOrValuesConditional(funcsOrValues, args, -2)
  }
}

module.exports = switchCase
