const ComparisonOperator = require('./_internal/ComparisonOperator')
const equals = require('./_internal/equals')

/**
 * @name eq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Resolver = (...arguments)=>Promise|any
 *
 * eq(leftValue Promise|any, rightValue Promise|any) -> Promise|boolean
 * eq(...arguments, leftResolver Resolver, rightValue Promise|any) -> Promise|boolean
 * eq(...arguments, leftValue Promise|any, rightResolver Resolver) -> Promise|boolean
 * eq(...arguments, leftResolver Resolver, rightResolver Resolver) -> Promise|boolean
 *
 * eq(leftResolver Resolver, rightValue Promise|any)(...arguments) -> Promise|boolean
 * eq(leftValue Promise|any, rightResolver Resolver)(...arguments) -> Promise|boolean
 * eq(leftResolver Resolver, rightResolver Resolver)(...arguments) -> Promise|boolean
 * ```
 *
 * @description
 * Comparison operator. Tests for equality (`==`) between two values.
 *
 * ```javascript [playground]
 * const areNamesEqual = eq('Ted', 'John')
 *
 * console.log(areNamesEqual)
 * ```
 *
 * If either of the two values are resolver functions, `eq` returns a function that resolves the values to compare.
 *
 * ```javascript [playground]
 * const personIsJohn = eq(get('name'), 'John')
 * const personLikesBananas = eq(get('likes'), 'bananas')
 *
 * const person = { name: 'John', likes: 'bananas' }
 *
 * if (personIsJohn(person) && personLikesBananas(person)) {
 *   console.log('John likes bananas.')
 * }
 * ```
 *
 * If either of the two resolver functions is asynchronous, `eq` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const userbase = new Map()
 *
 * userbase.set('example-id', { name: 'John', likes: 'bananas' })
 *
 * async function getUserNameById(id) {
 *   const user = userbase.get(id)
 *   if (user) {
 *     return user.name
 *   }
 *   return undefined
 * }
 *
 * const booleanResult = await eq('example-id', getUserNameById, 'John')
 *
 * console.log(booleanResult)
 * ```
 *
 * `eq` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * pipe({ name: 'John' }, [
 *   eq('John', get('name')),
 *   console.log,
 * ])
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the eager interface only.
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
