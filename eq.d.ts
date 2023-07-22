export = eq;
/**
 * @name eq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * eq(leftValue Promise|any, rightValue Promise|any) -> boolean
 *
 * eq(leftValue Promise|any, right function)(...args) -> Promise|boolean
 * eq(...args, leftValue Promise|any, right function) -> Promise|boolean
 *
 * eq(left function, rightValue Promise|any)(...args) -> Promise|boolean
 * eq(...args, left function, rightValue Promise|any) -> Promise|boolean
 *
 * eq(left function, right function)(...args) -> Promise|boolean
 * eq(...args, left function, right function) -> Promise|boolean
 * ```
 *
 * @description
 * Test for [equality (`==`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) between two values.
 *
 * ```javascript [playground]
 * const areNamesEqual = eq('Ted', 'George')
 *
 * console.log(areNamesEqual) // false
 * ```
 *
 * If either of the two values are resolver functions, `eq` returns a function that resolves the values to compare from its arguments.
 *
 * ```javascript [playground]
 * const personIsGeorge = eq(get('name'), 'George')
 *
 * const person = { name: 'George', likes: 'bananas' }
 *
 * if (personIsGeorge(person)) {
 *   console.log('The person is george')
 * }
 * ```
 *
 * `eq` supports a tacit API for composability.
 *
 * ```javascript [playground]
 * pipe({ name: 'George' }, [
 *   eq('George', get('name')),
 *   console.log, // true
 * ])
 * ```
 *
 * @execution concurrent
 */
declare const eq: (...args: any[]) => any;
