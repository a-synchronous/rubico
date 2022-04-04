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
 * Negate a value (`!`)
 *
 * ```javascript [playground]
 * const myObj = { a: 1 }
 *
 * console.log(not('a' in myObj)) // false
 * console.log(not('b' in myObj)) // true
 * ```
 *
 * If passed a function predicate, `not` returns a logically inverted predicate that returns true everywhere the original predicate would have returned false and vice versa.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   not(isOdd)(3),
 * ) // false
 * ```
 */
const not = function (funcOrValue) {
  if (typeof funcOrValue == 'function') {
    return function logicalInverter(value) {
      const boolean = funcOrValue(value)
      return isPromise(boolean) ? boolean.then(_not) : !boolean
    }
  }
  return !funcOrValue
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
