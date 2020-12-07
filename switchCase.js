const funcConditional = require('./_internal/funcConditional')

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
 * Conditional operator for functions. Cases are defined as pairings of `predicate` and `resolver`, with the exception of the last, default case.
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
 * If an even number of functions is supplied, the last predicate should always return true.
 *
 * ```javascript [playground]
 * const questionableIsOdd = switchCase([
 *   number => number === 1, () => true,
 *   number => number === 2, () => false,
 *   number => number === 3, () => true,
 *   number => number === 4, () => false,
 *   number => number === 5, () => true,
 *   () => true, number => number % 2 === 1,
 * ])
 *
 * console.log(questionableIsOdd(1)) // true
 * console.log(questionableIsOdd(6)) // false
 * ```
 */
const switchCase = funcs => function switchingCases(...args) {
  return funcConditional(funcs, args, -2)
}

module.exports = switchCase
