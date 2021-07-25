const isString = require('./isString')
const isArray = require('../_internal/isArray')

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

const prepend = item => function prependFunc(value) {

    if (isArray(value)) {
      if (isArray(item)){
        return [...item, ...value]
      }
      return [item, ...value]
    }

    if (isString(value)){
      if (!isString(item)){
        throw new TypeError(`${item} is not a string`)
      }
      return `${item}${value}`
    }

    throw new TypeError(`${value} is not an Array or string`)
  }

module.exports = prepend
