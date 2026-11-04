const __ = require('./_internal/placeholder')
const ComparisonOperator = require('./_internal/ComparisonOperator')
const equals = require('./_internal/equals')

/**
 * @name eq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Resolver = (...arguments)=>Promise|any
 *
 * eq(leftValue Promise|any, rightValue Promise|any) -> booleanResult Promise|boolean
 * eq(leftValue Promise|any)(rightValue any) -> booleanResult Promise|boolean
 * eq(...arguments, leftResolver Resolver, rightValue Promise|any) -> booleanResult Promise|boolean
 * eq(...arguments, leftValue Promise|any, rightResolver Resolver) -> booleanResult Promise|boolean
 * eq(...arguments, leftResolver Resolver, rightResolver Resolver) -> booleanResult Promise|boolean
 *
 * eq(leftResolver Resolver, rightValue Promise|any)(...arguments) -> booleanResult Promise|boolean
 * eq(leftValue Promise|any, rightResolver Resolver)(...arguments) -> booleanResult Promise|boolean
 * eq(leftResolver Resolver, rightResolver Resolver)(...arguments) -> booleanResult Promise|boolean
 * ```
 *
 * @description
 * Comparison operator. Tests for equality (`==`) between two values.
 *
 * ```javascript [playground]
 * const myVar = "z"
 *
 * const log = x => thunkify(console.log, x)
 *
 * switchCase(
 *   myVar,
 *   eq("a"), log("first"),
 *   eq("b"), log("second"),
 *   eq("c"), log("third"),
 *   eq("z"), log("last"),
 *   log("unknown"),
 * )
 * ```
 *
 * If either of the two values are resolver functions, `eq` returns a function that resolves the values to compare.
 *
 * ```javascript [playground]
 * const personIsJohn = eq(get('name'), 'Jim')
 * const personLikesBananas = eq(get('likes'), 'bananas')
 *
 * const person = { name: 'Jim', likes: 'bananas' }
 *
 * if (personIsJohn(person) && personLikesBananas(person)) {
 *   console.log('Jim likes bananas.')
 * }
 * ```
 *
 * If either of the two resolver functions is asynchronous, `eq` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const profilebase = new Map()
 *
 * profilebase.set('example-id', { name: 'Jim', likes: 'bananas' })
 *
 * async function getProfileNameById(id) {
 *   const profile = profilebase.get(id)
 *   if (profile) {
 *     return profile.name
 *   }
 *   return undefined
 * }
 *
 * const booleanResult = await eq('example-id', getProfileNameById, 'Jim')
 *
 * console.log(booleanResult)
 * ```
 *
 * `eq` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * const bool = eq(1)(1)
 * console.log(bool)
 *
 * pipe(
 *   { name: 'Jim' },
 *   eq('Jim', get('name')),
 *   console.log
 * )
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the immediate interface only.
 *
 * ```javascript [playground]
 * eq(Promise.resolve({ a: 1, b: 1 }), get('a'), get('b')).then(console.log)
 * ```
 *
 * See also:
 *  * [and](/docs/and)
 *  * [gt](/docs/gt)
 *  * [lt](/docs/lt)
 *  * [gte](/docs/gte)
 *  * [lte](/docs/lte)
 *  * [thunkify](/docs/thunkify)
 *
 * @execution concurrent
 */

const eq = ComparisonOperator(equals)

module.exports = eq
