export = find;
/**
 * @name find
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: (any, T)=>any }|Object<T>
 *
 * var T any,
 *   predicate T=>Promise|boolean,
 *   foldable Foldable<T>,
 *   result Promise|T|undefined
 *
 * find(predicate)(foldable) -> result
 * ```
 *
 * @description
 * Get the first item in a foldable collection that matches a predicate.
 *
 * ```javascript [playground]
 * import find from 'https://unpkg.com/rubico/dist/x/find.es.js'
 *
 * const users = [
 *   { name: 'John', age: 16 },
 *   { name: 'Jill', age: 32 },
 *   { name: 'John', age: 51 },
 * ]
 *
 * console.log(
 *   find(user => user.age > 50)(users),
 * ) // { name: 'John', age: 51 }
 * ```
 */
declare function find(predicate: any): (value: any) => any;
