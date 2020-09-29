const isPromise = require('./_internal/isPromise')

// true -> false
const _not = value => !value

/**
 * @name not
 *
 * @synopsis
 * ```coffeescript [specscript]
 * not<
 *   args ...any,
 *   predicate ...args=>Promise|boolean,
 * >(predicate)(...args) -> negated boolean
 * ```
 *
 * @description
 * Negate a predicate (`!`) by negating its return value.
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
const not = func => function logicalInverter(...args) {
  const boolean = func(...args)
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
 * not.sync<args ...any>(
 *   predicate ...args=>boolean,
 * ) -> negated ...args=>boolean
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
