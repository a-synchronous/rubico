export = isDeepEqual;
/**
 * @name isDeepEqual
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Nested<T> = Array<Array<T>|Object<T>|Iterable<T>|T>|Object<Array<T>|Object<T>|Iterable<T>|T>
 *
 * var left Nested,
 *   right Nested
 *
 * isDeepEqual(left, right) -> boolean
 * ```
 *
 * @description
 * Check two values for deep [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero) equality.
 *
 * ```javascript [playground]
 * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
 *
 * console.log(
 *   isDeepEqual({ a: 1, b: 2, c: [3] }, { a: 1, b: 2, c: [3] }),
 * ) // true
 *
 * console.log(
 *   isDeepEqual({ a: 1, b: 2, c: [3] }, { a: 1, b: 2, c: [5] }),
 * ) // false
 * ```
 *
 * When passed a resolver function as the left or right argument or resolvers as both arguments, returns a function that resolves the value by the resolver before performing the deep equal comparison.
 *
 * ```javascript [playground]
 * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
 *
 * const isPropADeepEqualTo123Array = isDeepEqual(object => object.a, [1, 2, 3])
 *
 * console.log(
 *   isPropADeepEqualTo123Array({ a: [1, 2, 3] }),
 * ) // true
 * ```
 */
declare function isDeepEqual(left: any, right: any): any;
