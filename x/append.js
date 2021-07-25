const isString = require('./isString')
const isArray = require('../_internal/isArray')

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

const append = item => function appendFunc(value) {

    if (isArray(value)) {
      if (isArray(item)){
        return [...value, ...item]
      }
      return [...value, item]
    }

    if (isString(value)){
      if (!isString(item)){
        throw new TypeError(`${item} is not a string`)
      }
      return `${value}${item}`
    }

    throw new TypeError(`${value} is not an Array or string`)
  }

module.exports = append
