const ComparisonOperator = require('./_internal/ComparisonOperator')
const greaterThan = require('./_internal/greaterThan')

/**
 * @name gt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Resolver = (...arguments)=>Promise|any
 *
 * gt(leftValue Promise|any, rightValue Promise|any) -> booleanResult Promise|boolean
 * gt(leftValue Promise|any)(rightValue any) -> booleanResult Promise|boolean
 * gt(...arguments, leftResolver Resolver, rightValue Promise|any) -> booleanResult Promise|boolean
 * gt(...arguments, leftValue Promise|any, rightResolver Resolver) -> booleanResult Promise|boolean
 * gt(...arguments, leftResolver Resolver, rightResolver Resolver) -> booleanResult Promise|boolean
 *
 * gt(leftResolver Resolver, rightValue Promise|any)(...arguments) -> booleanResult Promise|boolean
 * gt(leftValue Promise|any, rightResolver Resolver)(...arguments) -> booleanResult Promise|boolean
 * gt(leftResolver Resolver, rightResolver Resolver)(...arguments) -> booleanResult Promise|boolean
 * ```
 *
 * @description
 * Comparison operator. Tests if a value is greater than (`>`) another value.
 *
 * ```javascript [playground]
 * const array = [{ value: 3 }, { value: 1 }, { value: 5 }, { value: 4 }, { value: 2 }]
 *
 * const comparator = gt(get("value"), get("value"))
 *
 * array.sort(switchCase(comparator, 1, -1))
 *
 * console.log(array)
 * ```
 *
 * One of the arguments to `gt` may be a resolver.
 *
 * ```javascript [playground]
 * const isOfLegalAge = gt(get('age'), 21)
 *
 * const juvenile = { age: 16 }
 *
 * console.log(isOfLegalAge(juvenile))
 * ```
 *
 * A function passed to `gt` can be asynchronous.
 *
 * ```javascript [playground]
 * const asyncIsOfLegalAge = gt(async person => person.age, 21)
 *
 * const juvenile = { age: 16 }
 *
 * asyncIsOfLegalAge(juvenile).then(console.log)
 * ```
 *
 * `gt` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * const bool = gt(2)(1)
 * console.log(bool)
 *
 * pipe(
 *   { value: 1 },
 *   gt(5, get('value')),
 *   console.log
 * )
 * ```
 *
 * Promises are resolved before comparing their values.
 *
 * ```javascript [playground]
 * gt(Promise.resolve(2), Promise.resolve(1)).then(console.log)
 * ```
 *
 * See also:
 *  * [and](/docs/and)
 *  * [eq](/docs/eq)
 *  * [lt](/docs/lt)
 *  * [gte](/docs/gte)
 *  * [lte](/docs/lte)
 *  * [thunkify](/docs/thunkify)
 *
 */
const gt = ComparisonOperator(greaterThan)

module.exports = gt
