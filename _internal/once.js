/**
 * @name once
 *
 * @synopsis
 * ```coffeescript [specscript]
 * once(func function) -> funcThatRunsOnce function
 * ```
 */
const once = function (func) {
  let didCall = false
  return function onceFunc(...args) {
    if (didCall) {
      return undefined
    }
    didCall = true
    return func(...args)
  }
}

module.exports = once
