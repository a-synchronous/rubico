/* rubico v1.5.0
 * https://github.com/a-synchronous/rubico/monad/possible-promise
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

'use strict'

const isPromise = x => x && typeof x.then === 'function'

/*
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

/*
 * @name PossiblePromise.prototype.then
 *
 * @synopsis
 * new PossiblePromise(p Promise|any).then(f function) -> Promise|any
 *
 * @catchphrase
 * .then if internal Promise, else call
 */
PossiblePromise.prototype.then = function(f) {
  return isPromise(this.value) ? this.value.then(f) : f(this.value)
}

/*
 * @name PossiblePromise.then
 *
 * @synopsis
 * PossiblePromise.then(p Promise|any, f function) -> Promise|any
 *
 * @catchphrase
 * .then if passed a Promise, else call
 */
PossiblePromise.then = (p, f) => isPromise(p) ? p.then(f) : f(p)

/*
 * @name PossiblePromise.catch
 *
 * @synopsis
 * PossiblePromise.catch(
 *   p Promise|any,
 *   f Error=>Promise|any,
 * ) -> Promise|any
 *
 * @catchphrase
 * .catch if passed a Promise, else noop
 */
PossiblePromise.catch = (p, f) => isPromise(p) ? p.catch(f) : p

/*
 * @name PossiblePromise.all
 *
 * @synopsis
 * PossiblePromise.all(
 *   ps Promise<Array>|Array,
 * ) -> Promise<Array>|PossiblePromise<Array>
 *
 * @catchphrase
 * Always returns a thenable of an Array
 */
PossiblePromise.all = ps => (ps.some(isPromise)
  ? Promise.all(ps)
  : new PossiblePromise(ps))

/*
 * @name PossiblePromise.args
 *
 * @synopsis
 * PossiblePromise.args(f function)(args ...any) -> Promise|any
 *
 * @catchphrase
 * Resolves any Promises supplied as arguments to a function
 */
PossiblePromise.args = f => (...args) => (
  PossiblePromise.all(args).then(resolved => f(...resolved)))


module.exports = PossiblePromise
