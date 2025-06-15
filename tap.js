const isPromise = require('./_internal/isPromise')
const always = require('./_internal/always')
const thunkifyArgs = require('./_internal/thunkifyArgs')
const thunkConditional = require('./_internal/thunkConditional')
const curry2 = require('./_internal/curry2')
const curry3 = require('./_internal/curry3')
const curryArgs2 = require('./_internal/curryArgs2')
const curryArgs3 = require('./_internal/curryArgs3')
const __ = require('./_internal/placeholder')
const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const promiseAll = require('./_internal/promiseAll')

// _tap(args Array, f function) -> Promise|any
const _tap = function (args, f) {
  const result = args[0],
    call = f(...args)
  return isPromise(call) ? call.then(always(result)) : result
}

/**
 * @name tap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * args Array<any>
 * argsOrPromises Array<Promise|any>
 *
 * type SyncOrAsyncFunction = (...args)=>Promise|any
 *
 * f SyncOrAsyncFunction
 *
 * tap(...argsOrPromises, f) -> Promise|args[0]
 * tap(f)(...args) -> Promise|args[0]
 * ```
 *
 * @description
 * Call a function with provided arguments, returning the first argument. The return value of the function call is discarded.
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
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * tap(Promise.resolve(1), Promise.resolve(2), 3, console.log) // 1 2 3
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [compose](/docs/compose)
 *  * [tap.if](/docs/tap.if)
 *  * [switchCase](/docs/switchCase)
 *  * [tryCatch](/docs/tryCatch)
 */
const tap = function (...args) {
  const f = args.pop()
  if (args.length == 0) {
    return curryArgs2(_tap, __, f)
  }
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(_tap, __, f))
  }
  return _tap(args, f)
}

/**
 * @name _tapIf
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _tapIf(
 *   predicate function,
 *   f function,
 *   args Array,
 * ) -> Promise|args[0]
 * ```
 */
const _tapIf = function (predicate, f, args) {
  const b = predicate(...args)
  if (isPromise(b)) {
    return b.then(curry3(
      thunkConditional,
      __,
      thunkifyArgs(tap(f), args),
      always(args[0]),
    ))
  }
  if (b) {
    const execution = f(...args)
    if (isPromise(execution)) {
      return execution.then(always(args[0]))
    }
  }
  return args[0]
}

/**
 * @name tap.if
 *
 * @synopsis
 * ```coffeescript [specscript]
 * args Array<any>
 * argsOrPromises Array<Promise|any>
 *
 * type SyncOrAsyncPredicate = (...args)=>Promise|boolean|any
 * type SyncOrAsyncFunction = (...args)=>Promise|any
 *
 * predicate SyncOrAsyncPredicate
 * f SyncOrAsyncFunction
 *
 * tap.if(...argsOrPromises, predicate, f) -> Promise|args[0]
 * tap.if(predicate, f)(...args) -> Promise|args[0]
 * ```
 *
 * @description
 * A version of `tap` that accepts a predicate function (a function that returns a boolean value) before the function `f` to execute. Only executes `f` if the predicate function tests true. The arguments are the same to both the predicate function and the function to execute `f`.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const logIfOdd = tap.if(isOdd, console.log)
 *
 * logIfOdd(2)
 * logIfOdd(3) // 3
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * tap.if(Promise.resolve(1), n => n < 5, console.log) // 1
 * tap.if(Promise.resolve(6), n => n < 5, console.log)
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [compose](/docs/compose)
 *  * [tap](/docs/tap)
 *  * [switchCase](/docs/switchCase)
 *  * [tryCatch](/docs/tryCatch)
 */

tap.if = function (...args) {
  if (args.length == 2) {
    return curryArgs3(_tapIf, args[0], args[1], __)
  }
  const argsLength = args.length
  const f = args[argsLength - 1]
  const predicate = args[argsLength - 2]
  const argValues = args.slice(0, -2)
  if (areAnyValuesPromises(argValues)) {
    return promiseAll(argValues).then(curry3(_tapIf, predicate, f, __))
  }
  return _tapIf(predicate, f, args)
}

module.exports = tap
