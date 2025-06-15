const ComparisonOperator = require('./_internal/ComparisonOperator')
const equals = require('./_internal/equals')

/**
 * @name eq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * args Array<any>
 * argsOrPromises Array<Promise|any>
 *
 * type SyncOrAsyncResolver = (...args)=>Promise|any
 *
 * leftValue Promise|any
 * rightValue Promise|any
 * leftResolver SyncOrAsyncResolver
 * rightResolver SyncOrAsyncResolver
 *
 * eq(leftValue, rightValue) -> Promise|boolean
 * eq(...argsOrPromises, leftResolver, rightValue) -> Promise|boolean
 * eq(...argsOrPromises, leftValue, rightResolver) -> Promise|boolean
 * eq(...argsOrPromises, leftResolver, rightResolver) -> Promise|boolean
 * eq(leftResolver, rightValue)(...args) -> Promise|boolean
 * eq(leftValue, rightResolver)(...args) -> Promise|boolean
 * eq(leftResolver, rightResolver)(...args) -> Promise|boolean
 *
 * ```
 *
 * @description
 * Function equivalent to the [Equality (==)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) operator. Tests for equality (`==`) between two values.
 *
 * ```javascript [playground]
 * const areNamesEqual = eq('Ted', 'John')
 *
 * console.log(areNamesEqual) // false
 * ```
 *
 * If either of the two values are resolver functions, `eq` returns a function that resolves the value(s) to compare.
 *
 * ```javascript [playground]
 * const personIsJohn = eq(get('name'), 'John')
 *
 * const person = { name: 'John', likes: 'bananas' }
 *
 * if (personIsJohn(person)) {
 *   console.log('The person is John')
 * }
 * ```
 *
 * If either of the two resolver functions is asynchronous, `eq` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const asyncPersonIsJohn = eq(async person => person.name, 'John')
 *
 * const person = { name: 'John', likes: 'bananas' }
 *
 * asyncPersonIsJohn(person).then(condition => {
 *   if (condition) {
 *     console.log('The person is John')
 *   }
 * })
 * ```
 *
 * `eq` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe({ name: 'John' }, [
 *   eq('John', get('name')),
 *   console.log, // true
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * eq(Promise.resolve({ a: 1, b: 1 }), get('a'), get('b')).then(console.log) // true
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
