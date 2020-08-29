'use strict'

/**
 * @name BrokenPromise
 *
 * @catchphrase
 * a Promise that never comes back
 *
 * @synopsis
 * new BrokenPromise() -> BrokenPromise {}
 *
 * @description
 * A **BrokenPromise** is a Promise that never resolves or rejects, taking an infinite amount of time to get back to the caller.
 *
 * ```javascript
 * new BrokenPromise() // a new BrokenPromise instance
 * ```
 */
const BrokenPromise = function () {
  this.promise = new Promise(resolve => { this._resolve = resolve })
  this.timeout = setTimeout(this.resolve, 1e9)
}

/**
 * @name BrokenPromise.prototype.then
 *
 * @catchphrase
 * register an unreachable resolver
 *
 * @synopsis
 * new BrokenPromise().then(unreachableResolver function)
 *
 * @description
 * **BrokenPromise.prototype.then** registers a Promise `.then` resolver function with the internal infinite promise. In that sense, the resolver function _technically_ never gets called. However, it is possible to manually fire the provided `unreachableResolver` with `BrokenPromise.prototype.resolve`.
 *
 * ```javascript
 * new BrokenPromise().then(() => console.log('unreachable'))
 * ```
 */
BrokenPromise.prototype.then = function then(unreachableResolver) {
  return this.promise.then(unreachableResolver)
}

/**
 * @name BrokenPromise.prototype.resolve
 *
 * @catchphrase
 * manually resolve a broken promise
 *
 * @synopsis
 * const brokenPromise = new BrokenPromise().then(
 *   () => console.log('only reachable by .resolve'))
 *
 * brokenPromise.resolve()
 * // only reachable by .resolve
 */
BrokenPromise.prototype.resolve = function resolve(value) {
  clearTimeout(this.timeout)
  this._resolve(value)
  return this.promise
}

module.exports = BrokenPromise
