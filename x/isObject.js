const isObject = require('../_internal/isObject')

/**
 * @name isObject
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isObject(value any) -> boolean
 * ```
 *
 * @description
 * Determine whether a value has the [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types) of `Object`.
 *
 * ```javascript [playground]
 * import isObject from 'https://unpkg.com/rubico/dist/x/isObject.es.js'
 *
 * console.log(
 *   isObject({ a: 1, b: 2, c: 3 }),
 * ) // true
 *
 * console.log(
 *   isObject('hey'),
 * ) // false
 *
 * console.log(
 *   isObject(new Set([1, 2, 3])),
 * ) // true
 * ```
 */

module.exports = isObject
