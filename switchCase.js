const promiseAll = require('./_internal/promiseAll')
const isPromise = require('./_internal/isPromise')
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
 * type Predicate = (...arguments)=>Promise|boolean|any
 * type Function = (...arguments)=>Promise|any
 *
 * conditionalValues Array<Promise|boolean|any>
 * conditionalFunctionsOrValues Array<Predicate|Function|Promise|boolean|any>
 *
 * switchCase(conditionalValues) -> result Promise|any
 * switchCase(...arguments, conditionalFunctionsOrValues) -> result Promise|any
 * switchCase(argument, ...conditionalFunctionsOrValues) -> result Promise|any
 * switchCase(conditionalFunctionsOrValues)(...arguments) -> result Promise|any
 * ```
 *
 * @description
 * Conditional function operator. Accepts an array of conditional functions or values that specifies cases as function or value pairs with the exception of the last, default function or value. All functions are provided with the same arguments and executed in series. The result of a conditional execution with `switchCase` is the result of the execution of the first truthy function or value pair, the result of the execution of the last, default function, or the provided last, default value.
 *
 * ```javascript [playground]
 * function isOdd(n) {
 *   return n % 2 == 1
 * }
 *
 * switchCase(1, [
 *   isOdd,
 *   n => console.log(`${n} is odd`),
 *   n => console.log(`${n} is even`),
 * ])
 * ```
 *
 * `switchCase` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * const fruitsGuesser = switchCase([
 *   fruit => fruit.color == 'yellow',
 *   fruit => fruit.name + ' is possibly a banana',
 *   fruit => fruit.name + ' is possibly not a banana',
 * ])
 *
 * const guess1 = fruitsGuesser({ name: 'plantain', color: 'yellow' })
 * const guess2 = fruitsGuesser({ name: 'apple', color: 'red' })
 *
 * console.log(guess1)
 * console.log(guess2)
 * ```
 *
 * Any item of the conditional array passed to switchCase can be a nonfunction (object or primitive) value.
 *
 * ```javascript [playground]
 * function identity (value) {
 *   return value
 * }
 *
 * const value = switchCase(false, [
 *   identity,
 *   'non-function',
 *   'default-value',
 * ])
 *
 * console.log(value)
 * ```
 *
 * If every item in the conditional array is a nonfunction value, `switchCase` executes immediately.
 *
 * ```javascript [playground]
 * const age = 26
 *
 * const myDrink = switchCase([age >= 21, 'Water', 'Juice'])
 *
 * console.log(myDrink)
 * ```
 *
 * A single argument and one or more functions passed to `switchCase` executes immediately.
 *
 * ```javascript [playground]
 * switchCase(
 *   1,
 *   n => n % 2 == 0,
 *   () => console.log('even'),
 *   () => console.log('odd')
 * )
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the immediate interface only. Any promises in the conditional array are resolved before further execution for both the lazy and immediate interface.
 *
 * ```javascript [playground]
 * switchCase(Promise.resolve(1), 2, Promise.resolve(3), [
 *   function doValuesAddUpTo6(a, b, c) {
 *     return a + b + c === 6
 *   },
 *   (a, b, c) => console.log(`${a} + ${b} + ${c} === 6`),
 *   (a, b, c) => console.log(`${a} + ${b} + ${c} !== 6`),
 * ])
 *
 * const result = await switchCase(true, [
 *   bool => bool,
 *   Promise.resolve(1),
 *   Promise.resolve(2),
 * ])
 *
 * console.log(result)
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [tap.if](/docs/tap.if)
 *  * [tryCatch](/docs/tryCatch)
 *  * [all](/docs/all)
 *
 * @execution series
 */
const switchCase = (...args) => {
  if (typeof args[0] != 'function' && typeof args[1] == 'function') {
    const arg = args.shift()
    return isPromise(arg)
      ? arg.then(curryArgs3(arrayConditional, args, __, -2))
      : arrayConditional(args, [arg], -2)
  }
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
