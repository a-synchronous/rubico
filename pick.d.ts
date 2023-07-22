export = pick;
/**
 * @name pick
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pick(object Object, keys Array<string>) -> result Object
 *
 * pick(keys Array<string>)(object Object) -> result Object
 * ```
 *
 * @description
 * Creates a new object from a source object by selecting provided keys. If a provided key does not exist on the source object, excludes it from the resulting object.
 *
 * ```javascript [playground]
 * console.log(
 *   pick({ goodbye: 1, world: 2 }, ['hello', 'world']),
 * ) // { world: 2 }
 * ```
 *
 * `pick` supports three types of path patterns for nested property access
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * const nested = { a: { b: { c: { d: 1, e: [2, 3] } } } }
 *
 * console.log(pick(['a.b.c.d'])(nested)) // { a: { b: { c: { d: 1 } } } }
 * ```
 *
 * Compose `pick` inside a `pipe` with its tacit API.
 *
 * ```javascript [playground]
 * pipe({ a: 1, b: 2, c: 3 }, [
 *   map(number => number ** 2),
 *   pick(['a', 'c']),
 *   console.log, // { a: 1, c: 9 }
 * ])
 * ```
 */
declare function pick(arg0: any, arg1: any): any;
