const ComparisonOperator = require('./_internal/ComparisonOperator')
const greaterThanOrEqual = require('./_internal/greaterThanOrEqual')

/**
 * @name gte
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Resolver = (...arguments)=>Promise|any
 *
 * gte(leftValue Promise|any, rightValue Promise|any) -> booleanResult Promise|boolean
 * gte(...arguments, leftResolver Resolver, rightValue Promise|any) -> booleanResult Promise|boolean
 * gte(...arguments, leftValue Promise|any, rightResolver Resolver) -> booleanResult Promise|boolean
 * gte(...arguments, leftResolver Resolver, rightResolver Resolver) -> booleanResult Promise|boolean
 *
 * gte(leftResolver Resolver, rightValue Promise|any)(...arguments) -> booleanResult Promise|boolean
 * gte(leftValue Promise|any, rightResolver Resolver)(...arguments) -> booleanResult Promise|boolean
 * gte(leftResolver Resolver, rightResolver Resolver)(...arguments) -> booleanResult Promise|boolean
 * ```
 *
 * @description
 * Comparison operator. Tests if a value is greater than or equal (`>=`) to another value.
 *
 * ```javascript [playground]
 * const age = 20
 *
 * const isAdultAge = gte(age, 18)
 *
 * console.log(isAdultAge)
 * ```
 *
 * If either of the two values are resolver functions, `gte` returns a function that resolves the values to compare.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isAtLeast100 = gte(identity, 100)
 *
 * console.log(isAtLeast100(99))
 * console.log(isAtLeast100(100))
 * console.log(isAtLeast100(101))
 * ```
 *
 * If either of the two resolver functions is asynchronous, `gte` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const asyncIdentity = async value => value
 *
 * const asyncIsAtLeast100 = gte(asyncIdentity, 100)
 *
 * asyncIsAtLeast100(99).then(console.log)
 * asyncIsAtLeast100(100).then(console.log)
 * asyncIsAtLeast100(101).then(console.log)
 * ```
 *
 * `gte` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   gte(1, get('value')),
 *   console.log,
 * ])
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the immediate interface only.
 *
 * ```javascript [playground]
 * gte(Promise.resolve({ a: 1, b: 1 }), get('a'), get('b')).then(console.log)
 * ```
 *
 * See also:
 *  * [and](/docs/and)
 *  * [eq](/docs/eq)
 *  * [lt](/docs/lt)
 *  * [gt](/docs/gt)
 *  * [lte](/docs/lte)
 *  * [thunkify](/docs/thunkify)
 *
 */
const gte = ComparisonOperator(greaterThanOrEqual)

module.exports = gte
