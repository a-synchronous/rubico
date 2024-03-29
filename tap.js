const isPromise = require('./_internal/isPromise')
const always = require('./_internal/always')
const thunkifyArgs = require('./_internal/thunkifyArgs')
const thunkConditional = require('./_internal/thunkConditional')
const curry3 = require('./_internal/curry3')
const curryArgs2 = require('./_internal/curryArgs2')
const __ = require('./_internal/placeholder')

// _tap(args Array, func function) -> Promise|any
const _tap = function (args, func) {
  const result = args[0],
    call = func(...args)
  return isPromise(call) ? call.then(always(result)) : result
}

/**
 * @name tap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * tap(...args, func function) -> Promise|args[0]
 * tap(func function)(...args) -> Promise|args[0]
 * ```
 *
 * @description
 * Call a function with any number of arguments, returning the first argument. Promises created by the tapper are resolved before returning the value.
 *
 * ```javascript [playground]
 * const pipeline = pipe([
 *   tap(value => console.log(value)),
 *   tap(value => console.log(value + 'bar')),
 *   tap(value => console.log(value + 'barbaz')),
 * ])
 *
 * pipeline('foo') // 'foo'
 *                 // 'foobar'
 *                 // 'foobarbaz'
 * ```
 */
const tap = function (...args) {
  const func = args.pop()
  if (args.length == 0) {
    return curryArgs2(_tap, __, func)
  }
  return _tap(args, func)
}

/**
 * @name tap.if
 *
 * @synopsis
 * ```coffeescript [specscript]
 * tap.if(predicate function, func function)(...args) -> Promise|args[0]
 * ```
 *
 * @description
 * A version of `tap` that accepts a predicate function (a function that returns a boolean value) before the function to execute. Only executes the function if the predicate function tests true for the same arguments provided to the execution function.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const logIfOdd = tap.if(
 *   isOdd,
 *   number => console.log(number, 'is an odd number')
 * )
 *
 * logIfOdd(2)
 * logIfOdd(3) // 3 is an odd number
 * ```
 */
tap.if = (predicate, func) => function tappingIf(...args) {
  const predication = predicate(...args)
  if (isPromise(predication)) {
    return predication.then(curry3(
      thunkConditional, __, thunkifyArgs(tap(func), args), always(args[0])))
  }
  if (predication) {
    const execution = func(...args)
    if (isPromise(execution)) {
      return execution.then(always(args[0]))
    }
  }
  return args[0]
}

module.exports = tap
