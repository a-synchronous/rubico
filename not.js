const isPromise = require('./_internal/isPromise')

// true -> false
const _not = value => !value

/**
 * @name not
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   predicate ...args=>Promise|boolean
 *
 * not(predicate)(...args) -> boolean
 * ```
 *
 * @description
 * Negate a predicate (`!`)
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   not(isOdd)(3),
 * ) // false
 * ```
 *
 * @TODO
 * const not = funcNot
 * funcNotSync
 */
const not = func => function logicalInverter(value) {
  if (value != null && typeof value.not == 'function') {
    return value.not(func)
  }
  const boolean = func(value)
  return isPromise(boolean) ? boolean.then(_not) : !boolean
}

/**
 * @name notSync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * notSync(func ...any=>boolean) -> negated ...any=>boolean
 * ```
 */
const notSync = func => function notSync(...args) {
  return !func(...args)
}

/**
 * @name not.sync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   syncPredicate ...args=>boolean
 *
 * not.sync(syncPredicate)(...args) -> boolean
 * ```
 *
 * @description
 * `not` without promise handling.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   not.sync(isOdd)(2),
 * ) // true
 * ```
 */
not.sync = notSync

module.exports = not
