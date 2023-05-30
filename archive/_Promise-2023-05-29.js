const isPromise = require('./isPromise')

/**
 * @name _Promise
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new _Promise() -> _Promise
 * ```
 *
 * @description
 * Internal _Promise. Does not conform to spec.
 */
const _Promise = function () {
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []
  this.value = null
  this.error = null
  this.status = 'pending'
}

_Promise.prototype._fulfill = function (value) {
  if (this.status == 'pending') {
    this.status = 'fulfilled'
    this.value = value
    this.onFulfilledCallbacks.forEach(cb => cb(value)) // TODO optimize
  }
}

_Promise.prototype._reject = function (error) {
  if (this.status == 'pending') {
    this.status = 'rejected'
    this.error = error
    this.onRejectedCallbacks.forEach(cb => cb(error)) // TODO optimize
  }
}

_Promise.prototype.then = function (onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    if (this.status == 'pending') {
      this.onFulfilledCallbacks.push(() => {
        try {
          const ret = onFulfilled(this.value)
          if (isPromise(ret)) {
            ret.then(resolve, reject)
          } else {
            resolve(ret)
          }
        } catch (error) {
          reject(error)
        }
      })
      this.onRejectedCallbacks.push(() => {
        try {
          const ret = onRejected(this.error)
          if (isPromise(ret)) {
            ret.then(resolve, reject)
          } else {
            reject(ret)
          }
        } catch (error) {
          reject(error)
        }
      })
    }
    else if (this.status == 'fulfilled') {
      try {
        const ret = onFulfilled(this.value)
        if (isPromise(ret)) {
          ret.then(resolve, reject)
        } else {
          resolve(ret)
        }
      } catch (error) {
        reject(error)
      }
    }
    else {
      try {
        const ret = onRejected(this.error)
        if (isPromise(ret)) {
          ret.then(resolve, reject)
        } else {
          reject(ret)
        }
      } catch (error) {
        reject(error)
      }
    }
  })
}

module.exports = _Promise
