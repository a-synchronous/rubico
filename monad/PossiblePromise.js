/* rubico v1.5.0
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

'use strict'

const isPromise = value => value != null && typeof value.then == 'function'

const promiseAll = Promise.all.bind(Promise)

/**
 * @name PossiblePromise
 *
 * @synopsis
 * new PossiblePromise(value Promise|any) -> PossiblePromise
 *
 * @catchphrase
 * Possibly a Promise
 */
const PossiblePromise = function(value) {
  this.value = value
}

/**
 * @name PossiblePromise.prototype.then
 *
 * @synopsis
 * new PossiblePromise(value Promise|any).then(func function) -> Promise|any
 *
 * @catchphrase
 * .then if internal Promise, else call
 */
PossiblePromise.prototype.then = function(func) {
  const value = this.value
  return isPromise(value) ? value.then(func) : func(value)
}

/**
 * @name PossiblePromise.then
 *
 * @synopsis
 * PossiblePromise.then(value Promise|any, func function) -> Promise|any
 *
 * @catchphrase
 * .then if passed a Promise, else call
 */
PossiblePromise.then = (value, func) => (
  isPromise(value) ? value.then(func) : func(value))

/**
 * @name PossiblePromise.catch
 *
 * @synopsis
 * PossiblePromise.catch(
 *   value Promise|any,
 *   func any=>Promise|any,
 * ) -> Promise|any
 *
 * @catchphrase
 * .catch if passed a Promise, else noop
 */
PossiblePromise.catch = (value, func) => (
  isPromise(value) ? value.catch(func) : value)

/**
 * @name SyncThenable
 *
 * @synopsis
 * new SyncThenable(value any) -> SyncThenable
 *
 * @catchphrase
 * A synchronous Promise-like structure
 */
const SyncThenable = function(value) { this.value = value }

/**
 * @name SyncThenable.prototype.then
 *
 * @synopsis
 * new SyncThenable(value any).then(func function) -> any
 *
 * @catchphrase
 * .then as a function call
 */
SyncThenable.prototype.then = function(func) { return func(this.value) }

/**
 * @name PossiblePromise.all
 *
 * @synopsis
 * PossiblePromise.all(
 *   values Array<Promise>|Array,
 * ) -> Promise<Array>|PossiblePromise<Array>
 *
 * @catchphrase
 * Always returns a thenable of an Array
 */
PossiblePromise.all = values => (values.some(isPromise)
  ? promiseAll(values)
  : new SyncThenable(values))

/**
 * @name PossiblePromise.args
 *
 * @synopsis
 * PossiblePromise.args(func function)(args ...any) -> Promise|any
 *
 * @catchphrase
 * Resolves any Promises supplied as arguments to a function
 */
PossiblePromise.args = func => (...args) => (args.some(isPromise)
  ? promiseAll(args).then(res => func(...res))
  : func(...args))

/* PossiblePromise.argsSome = func => (...args) => (args.some(isPromise)
  ? promiseAll(args).then(res => func(...res))
  : func(...args))

PossiblePromise.argsSomeApply = func => {
  const fApply = func.apply.bind(func)
  return (...args) => (args.some(isPromise)
    ? promiseAll(args).then(res => fApply(null, res))
    : fApply(null, args))
}

PossiblePromise.argumentsLoop = func => function() {
  for (let i = 0; i < arguments.length; i++) {
    if (isPromise(arguments[i])) {
      return promiseAll(arguments).then(res => func(...res))
    }
  }
  return func.apply(null, arguments)
}

PossiblePromise.argsLoop = func => (...args) => {
  for (const arg of args) {
    if (isPromise(arg)) return promiseAll(args).then(res => func(...res))
  }
  return func(...args)
} */

module.exports = PossiblePromise
