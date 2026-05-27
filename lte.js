const ComparisonOperator = require('./_internal/ComparisonOperator')
const lessThanOrEqual = require('./_internal/lessThanOrEqual')

/**
 * @name lte
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Resolver = (...arguments)=>Promise|any
 *
 * lte(leftValue Promise|any, rightValue Promise|any) -> booleanResult Promise|boolean
 * lte(...arguments, leftResolver Resolver, rightValue Promise|any) -> booleanResult Promise|boolean
 * lte(...arguments, leftValue Promise|any, rightResolver Resolver) -> booleanResult Promise|boolean
 * lte(...arguments, leftResolver Resolver, rightResolver Resolver) -> booleanResult Promise|boolean
 *
 * lte(leftResolver Resolver, rightValue Promise|any)(...arguments) -> booleanResult Promise|boolean
 * lte(leftValue Promise|any, rightResolver Resolver)(...arguments) -> booleanResult Promise|boolean
 * lte(leftResolver Resolver, rightResolver Resolver)(...arguments) -> booleanResult Promise|boolean
 * ```
 *
 * @description
 * Comparison operator. Tests if a value is less than or equal (`<=`) to another value.
 *
 * ```javascript [playground]
 * console.log(lte(1, 3))
 * console.log(lte(3, 3))
 * console.log(lte(4, 3))
 * ```
 *
 * If either of the two values are resolver functions, `lte` returns a function that resolves the values to compare.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThanOrEqualTo3 = lte(identity, 3)
 *
 * console.log(isLessThanOrEqualTo3(1))
 * console.log(isLessThanOrEqualTo3(3))
 * console.log(isLessThanOrEqualTo3(5))
 * ```
 *
 * If either of the two resolver functions is asynchronous, `lte` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const asyncIdentity = async value => value
 *
 * const asyncIsLessThanOrEqualTo3 = lte(asyncIdentity, 3)
 *
 * asyncIsLessThanOrEqualTo3(1).then(console.log)
 * asyncIsLessThanOrEqualTo3(3).then(console.log)
 * asyncIsLessThanOrEqualTo3(5).then(console.log)
 * ```
 *
 * `lte` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   lte(1, get('value')),
 *   console.log,
 * ])
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * lte(Promise.resolve({ a: 1, b: 1 }), get('a'), get('b')).then(console.log)
 * ```
 *
 * See also:
 *  * [and](/docs/and)
 *  * [eq](/docs/eq)
 *  * [lt](/docs/lt)
 *  * [gt](/docs/gt)
 *  * [gte](/docs/gte)
 *  * [thunkify](/docs/thunkify)
 *
 */
const lte = ComparisonOperator(lessThanOrEqual)

module.exports = lte
