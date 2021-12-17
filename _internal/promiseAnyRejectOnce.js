const once = require('./once')

/**
 * @name promiseAnyRejectOnce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * promiseAnyRejectOnce(promises Array<Promise>) -> firstPromiseToResolve Promise
 * ```
 */
const promiseAnyRejectOnce = function (promises) {
  return new Promise((resolve, reject) => {
    const resolveOnce = once(resolve)
    const rejectOnce = once(reject)
    promises.forEach(promise => {
      promise.then(resolveOnce, rejectOnce)
    })
  })
}

module.exports = promiseAnyRejectOnce
