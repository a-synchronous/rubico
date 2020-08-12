/* rubico v1.5.0
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

'use strict'

const Instance = require('./Instance')

const { isPromise } = Instance

const promiseAll = Promise.all.bind(Promise)

/**
 * @name PossiblePromise
 *
 * @synopsis
 * new PossiblePromise(p Promise|any) -> PossiblePromise
 *
 * @catchphrase
 * Possibly a Promise
 */
const PossiblePromise = function(p) {
  this.value = p
}

/**
 * @name PossiblePromise.prototype.then
 *
 * @synopsis
 * new PossiblePromise(p Promise|any).then(f function) -> Promise|any
 *
 * @catchphrase
 * .then if internal Promise, else call
 */
PossiblePromise.prototype.then = function(f) {
  const p = this.value
  return isPromise(p) ? p.then(f) : f(p)
}

/**
 * @name PossiblePromise.then
 *
 * @synopsis
 * PossiblePromise.then(p Promise|any, f function) -> Promise|any
 *
 * @catchphrase
 * .then if passed a Promise, else call
 */
PossiblePromise.then = (p, f) => isPromise(p) ? p.then(f) : f(p)

/**
 * @name PossiblePromise.catch
 *
 * @synopsis
 * PossiblePromise.catch(
 *   p Promise|any,
 *   f any=>Promise|any,
 * ) -> Promise|any
 *
 * @catchphrase
 * .catch if passed a Promise, else noop
 */
PossiblePromise.catch = (p, f) => isPromise(p) ? p.catch(f) : p

/**
 * @name PossiblePromise.all
 *
 * @synopsis
 * PossiblePromise.all(
 *   ps Array<Promise>|Array,
 * ) -> Promise<Array>|PossiblePromise<Array>
 *
 * @catchphrase
 * Always returns a thenable of an Array
 */
PossiblePromise.all = ps => (ps.some(isPromise)
  ? promiseAll(ps)
  : new PossiblePromise(ps))

/**
 * @name PossiblePromise.args
 *
 * @synopsis
 * PossiblePromise.args(f function)(args ...any) -> Promise|any
 *
 * @catchphrase
 * Resolves any Promises supplied as arguments to a function
 */

PossiblePromise.args = f => (...args) => (args.some(isPromise)
  ? promiseAll(args).then(res => f(...res))
  : f(...args))

/* PossiblePromise.argsSome = f => (...args) => (args.some(isPromise)
  ? promiseAll(args).then(res => f(...res))
  : f(...args))

PossiblePromise.argsSomeApply = f => {
  const fApply = f.apply.bind(f)
  return (...args) => (args.some(isPromise)
    ? promiseAll(args).then(res => fApply(null, res))
    : fApply(null, args))
}

PossiblePromise.argumentsLoop = f => function() {
  for (let i = 0; i < arguments.length; i++) {
    if (isPromise(arguments[i])) {
      return promiseAll(arguments).then(res => f(...res))
    }
  }
  return f.apply(null, arguments)
}

PossiblePromise.argsLoop = f => (...args) => {
  for (const arg of args) {
    if (isPromise(arg)) return promiseAll(args).then(res => f(...res))
  }
  return f(...args)
} */

module.exports = PossiblePromise
