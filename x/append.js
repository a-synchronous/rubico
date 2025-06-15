const isString = require('./isString')
const isArray = require('../_internal/isArray')

/**
 * @name append
 *
 * @synopsis
 * ```coffeescript [specscript]
 * append(
 *   element string|Array,
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
 * See also:
 *  * [callProp](/docs/callProp)
 *
 * @since 1.7.3
 */

const append = element => function appendFunc(value) {

    if (isArray(value)) {
      if (isArray(element)){
        return [...value, ...element]
      }
      return [...value, element]
    }

    if (isString(value)){
      if (!isString(element)){
        throw new TypeError(`${element} is not a string`)
      }
      return `${value}${element}`
    }

    throw new TypeError(`${value} is not an Array or string`)
  }

module.exports = append
