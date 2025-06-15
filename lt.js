const ComparisonOperator = require('./_internal/ComparisonOperator')
const lessThan = require('./_internal/lessThan')

/**
 * @name lt
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
 * lt(leftValue, rightValue) -> Promise|boolean
 * lt(...argsOrPromises, leftResolver, rightValue) -> Promise|boolean
 * lt(...argsOrPromises, leftValue, rightResolver) -> Promise|boolean
 * lt(...argsOrPromises, leftResolver, rightResolver) -> Promise|boolean
 * lt(leftResolver, rightValue)(...args) -> Promise|boolean
 * lt(leftValue, rightResolver)(...args) -> Promise|boolean
 * lt(leftResolver, rightResolver)(...args) -> Promise|boolean
 * ```
 *
 * @description
 * Functional equivalent of the [Less than (<)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Less_than) operator. Tests if a value is less than (`<`) another value.
 *
 * ```javascript [playground]
 * console.log(lt(1, 3)) // true
 * console.log(lt(3, 3)) // false
 * console.log(lt(4, 3)) // false
 * ```
 *
 * If either of the two values are resolver functions, `lt` returns a function that resolves the value(s) to compare.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThan3 = lt(identity, 3)
 *
 * console.log(isLessThan3(1)) // true
 * console.log(isLessThan3(3)) // false
 * console.log(isLessThan3(5)) // false
 * ```
 *
 * If either of the resolver functions is asynchronous, `lt` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const asyncIdentity = async value => value
 *
 * const asyncIsLessThan3 = lt(asyncIdentity, 3)
 *
 * asyncIsLessThan3(1).then(console.log) // true
 * asyncIsLessThan3(3).then(console.log) // false
 * asyncIsLessThan3(5).then(console.log) // false
 * ```
 *
 * `lt` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   lt(0, get('value')),
 *   console.log, // true
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * lt(Promise.resolve({ a: 1, b: 2 }), get('a'), get('b')).then(console.log) // true
 * ```
 */
const lt = ComparisonOperator(lessThan)

module.exports = lt
