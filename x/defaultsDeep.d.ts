export = defaultsDeep;
/**
 * @name defaultsDeep
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var defaultCollection Array|Object,
 *   value Array|Object
 *
 * defaultsDeep(defaultCollection)(value) -> Array|Object
 * ```
 *
 * @description
 * Deeply assign default values to an array or object by an array or object of possibly nested default values.
 *
 * ```javascript [playground]
 * import defaultsDeep from 'https://unpkg.com/rubico/dist/x/defaultsDeep.es.js'
 *
 * const defaultUser = defaultsDeep({
 *   name: 'placeholder',
 *   images: [
 *     { url: 'https://via.placeholder.com/150' },
 *     { url: 'https://via.placeholder.com/150' },
 *     { url: 'https://via.placeholder.com/150' },
 *   ],
 * })
 *
 * console.log(defaultUser({
 *   name: 'John',
 *   images: [{ url: 'https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com' }],
 * }))
 * // {
 * //   name: 'John',
 * //   images: [
 * //    { url: 'https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com' },
 * //    { url: 'https://via.placeholder.com/150' },
 * //    { url: 'https://via.placeholder.com/150' },
 * //   ],
 * // }
 * ```
 */
declare function defaultsDeep(defaultCollection: any): (value: any) => any;
