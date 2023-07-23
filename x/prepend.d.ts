export = prepend;
/**
 * @name prepend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * prepend(
 *   item string|Array,
 * )(value string|Array) -> string|array
 * ```
 *
 * @description
 * Prepend a string or an array.
 *
 * ```javascript [playground]
 * import prepend from 'https://unpkg.com/rubico/dist/x/prepend.es.js'
 *
 * const myArray = ['orange', 'apple']
 *
 * {
 *   const result = prepend(['ananas'])(myArray)
 *   console.log(result) // ['ananas', 'orange', 'apple']
 * }
 *
 * {
 *   const result = prepend('ananas')(myArray)
 *   console.log(result) // ['ananas', 'orange', 'apple']
 * }
 *
 * {
 *   const result = prepend('hello ')('world')
 *   console.log(result) // 'hello world'
 * }
 * ```
 *
 * @since 1.7.3
 */
declare function prepend(item: any): (value: any) => string | any[];
