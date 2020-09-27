const isPromise = require('./_internal/isPromise')
const funcApply = require('./_internal/funcApply')
const curry2 = require('./_internal/curry2')
const curry3 = require('./_internal/curry3')
const thunkify1 = require('./_internal/thunkify1')
const thunkify3 = require('./_internal/thunkify3')
const thunkConditional = require('./_internal/thunkConditional')

/**
 * @name asyncFuncSwitch
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncFuncSwitch(
 *   funcs Array<args=>Promise|any>,
 *   args Array,
 *   funcsIndex number,
 * ) -> Promise|any
 * ```
 *
 * @TODO isPromise conditional await
 * @TODO benchmark vs regular promise handling
 */
const asyncFuncSwitch = async function (funcs, args, funcsIndex) {
  const lastIndex = funcs.length - 1
  while ((funcsIndex += 2) < lastIndex) {
    if (await funcs[funcsIndex](...args)) {
      return funcs[funcsIndex + 1](...args)
    }
  }
  return funcs[funcsIndex](...args)
}

/**
 * @name switchCase
 *
 * @synopsis
 * ```coffeescript [specscript]
 * switchCase<args ...any>(
 *   conditionalFunctions Array<...args=>Promise|boolean|any>
 * )(...args) -> result Promise|any
 * ```
 *
 * @description
 * Conditional operator for functions. Odd indexed functions should be resolvers, while even indexed functions excluding the last should be predicates. For an odd number of functions, the last even indexed function should be a default resolver function. Any predicates or resolvers may be asynchronous.
 *
 * ```javascript [playground]
 * const fruitIsYellow = fruit => fruit.color == 'yellow'
 *
 * const fruitsGuesser = switchCase([
 *   fruitIsYellow, fruit => fruit.name + ' is possibly a banana',
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
  const lastIndex = funcs.length - 1
  let funcsIndex = -2

  while ((funcsIndex += 2) < lastIndex) {
    const shouldReturnNext = funcs[funcsIndex](...args)
    if (isPromise(shouldReturnNext)) {
      return shouldReturnNext.then(curry3(
        thunkConditional,
        __,
        thunkify1(curry2(funcApply, funcs[funcsIndex + 1], __), args),
        thunkify3(asyncFuncSwitch, funcs, args, funcsIndex)))
    }
    if (shouldReturnNext) {
      return funcs[funcsIndex + 1](...args)
    }
  }
  return funcs[funcsIndex](...args)
}

module.exports = switchCase
