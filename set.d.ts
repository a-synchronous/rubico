export = set;
/**
 * @name set
 *
 * @synopsis
 * ```coffeescript [specscript]
 * set(
 *   object Promise|Object,
 *   path string|Array<string|number>,
 *   value function|any,
 * ) -> result Promise|Object
 *
 * set(
 *   path string|Array<string|number>,
 *   value function|any,
 * )(object Object) -> result Promise|Object
 * ```
 *
 * @description
 * Sets a property on a new object shallow cloned from the argument object given a path denoted by a string, number, or an array of string or numbers.
 *
 * `set` supports three types of path patterns for nested property access.
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * console.log(set({ b: 2 }, 'a', 1)) // { a: 1, b: 2 }
 *
 * const nestedAC2 = { a: { c: 2 } }
 *
 * console.log(set(nestedAC2, 'a.b', 1)) // { a : { b: 1, c: 2 }}
 *
 * const nestedA0BC3 = { a: [{ b: { c: 3 } }] }
 *
 * console.log(set(nestedA0BC3, 'a[0].b.c', 4)) // { a: [{ b: { c: 4 } }] }
 * ```
 *
 * The property value may be a function, in which case it is treated as a resolver and provided the argument object to resolve the value to set.
 *
 * ```javascript [playground]
 * const myObj = { a: 1 }
 *
 * const myNewObj = set('b', obj => obj.a + 2)(myObj)
 *
 * console.log(myNewObj) // { a: 1, b: 3 }
 * ```
 *
 * `set` supports a tacit API for composability.
 *
 * ```javascript [playground]
 * pipe({ a: 1 }, [
 *   set('b', 2),
 *   console.log, // { a: 1, b: 2 }
 * ])
 * ```
 *
 * @since 1.7.0
 */
declare function set(arg0: any, arg1: any, arg2: any): any;
