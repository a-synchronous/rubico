const promiseAll = require('./_internal/promiseAll')
const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const arrayConditional = require('./_internal/arrayConditional')
const areAllValuesNonfunctions = require('./_internal/areAllValuesNonfunctions')
const nonfunctionsConditional = require('./_internal/nonfunctionsConditional')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const curryArgs3 = require('./_internal/curryArgs3')

/**
 * @name switchCase
 *
 * @synopsis
 * ```coffeescript [specscript]
 * switchCase(conditionalValues Array<boolean|any>) -> Promise|any
 *
 * switchCase(
 *   ...args,
 *   conditionalFuncsOrValues Array<function|boolean|any>
 * ) -> Promise|any
 *
 * switchCase(
 *   conditionalFuncsOrValues Array<function|boolean|any>
 * )(...args) -> Promise|any
 * ```
 *
 * @description
 * Functional equivalent to the [Conditional (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator). Accepts an array of conditional functions that specifies cases as pairings of `predicate` and `resolver` functions with the exception of the last, default resolver. All functions are provided with the same arguments and executed in series. The result of a `switchCase` operation is either the result of the execution the last default resolver, or the result of the execution of the first resolver where the associated predicate tested true.
 *
 * ```javascript [playground]
 * const fruitIsYellow = fruit => fruit.color == 'yellow'
 *
 * console.log(
 *   switchCase({ name: 'plantain', color: 'yellow' }, [
 *     fruitIsYellow,
 *     fruit => fruit.name + ' is possibly a banana',
 *     fruit => fruit.name + ' is probably not a banana',
 *   ])
 * ) // plantain is possibly a banana
 * ```
 *
 * For composability `switchCase` supports a tacit API.
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
 * Any function can be replaced with a nonfunction (object or primitive) value to be used directly in the operation.
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
 * If every item in the conditional array is a nonfunction value, `switchCase` executes eagerly.
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
const switchCase = (...args) => {
  const values = args.pop()
  if (areAllValuesNonfunctions(values)) {
    return nonfunctionsConditional(values, -2)
  }
  if (args.length == 0) {
    return curryArgs3(arrayConditional, values, __, -2)
  }
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry3(arrayConditional, values, __, -2))
  }
  return arrayConditional(values, args, -2)
}

module.exports = switchCase
