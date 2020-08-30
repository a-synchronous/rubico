'use strict'

const isPromise = value => value != null && typeof value.then == 'function'

const promiseRace = Promise.race.bind(Promise)

/**
 * @name CancelToken
 *
 * @synopsis
 * new CancelToken() -> CancelToken {}
 */
const CancelToken = function () {
  this.promise = new Promise((_, reject) => { this._reject = reject })
}

/**
 * @name CancelToken.prototype.cancel
 *
 * @synopsis
 * new CancelToken().cancel(value Error|any) -> CancelToken {}
 */
CancelToken.prototype.cancel = function cancel(value) {
  this._reject(value)
  return this
}

/**
 * @name CancellablePromise
 *
 * @synopsis
 * CancellablePromise(value Promise|any)
 *   -> result Promise { cancel: Error|any=>this }
 */
const CancellablePromise = function (value) {
  const cancelToken = new CancelToken()
  const result = promiseRace([value, cancelToken.promise])
  result.cancel = function cancel(err) {
    cancelToken.cancel(err)
    result.cancel = function getter() { return result }
    return result
  }
  result.value = value
  return result
}

/**
 * @name Cancellable
 *
 * @catchphrase
 * make a function return cancellable Promises
 *
 * @synopsis
 * Promise { cancel: any=>() } -> CancellablePromise
 *
 * Cancellable(
 *   func ...any=>Promise|any,
 * ) -> cancellablePromiseFactory ...any=>CancellablePromise|any
 *
 * @description
 * **Cancellable** wraps an async function to apply an effect such that all Promises returned by the wrapped async function are cancellable via the `.cancel` method.
 *
 * ```javascript
 * const createInfinitePromise = () => Promise.race([])
 *
 * const createCancellablePromise = Cancellable(createInfinitePromise)
 *
 * const cancellablePromise = createCancellablePromise()
 *
 * cancellablePromise.cancel(new Error('cancelled')).catch(
 *   err => console.error(err)) // Error: cancelled
 * ```
 */
const Cancellable = func => function cancellablePromiseFactory(
  ...args
) {
  const result = func(...args)
  if (isPromise(result)) {
    return CancellablePromise(result)
  }
  return result
}

module.exports = Cancellable
