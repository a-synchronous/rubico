export = append;
/**
 * @name append
 *
 * @synopsis
 * ```coffeescript [specscript]
 * append(
 *   item string|Array,
 * )(value string|Array) -> string|array
 * ```
 *
 * @description
 * Append a string or an array.
 *
 * ```javascript [playground]
 * import append from 'https://unpkg.com/rubico/dist/x/append.es.js'
 *
 * const myArray = ['orange', 'apple']
 *
 * {
 *   const result = append(['ananas'])(myArray)
 *   console.log(result) // ['orange', 'apple', 'ananas']
 * }
 *
 * {
 *   const result = append('ananas')(myArray)
 *   console.log(result) // ['orange', 'apple', 'ananas']
 * }
 *
 * {
 *   const result = append('world')('hello ')
 *   console.log(result) // 'hello world'
 * }
 * ```
 *
 * @since 1.7.3
 */
declare function append(item: any): (value: any) => string | any[];
