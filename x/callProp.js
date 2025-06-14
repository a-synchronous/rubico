/**
 * @name callProp
 *
 * @synopsis
 * ```coffeescript [specscript]
 * callProp(property string, ...args)(object) -> object[property](...args)
 * ```
 *
 * @description
 * Calls a property on an object with arguments.
 *
 * ```javascript [playground]
 * import callProp from 'https://unpkg.com/rubico/dist/x/callProp.es.js'
 *
 * const priceRoundedDown = callProp('toFixed', 2)(5.992)
 * console.log('priceRoundedDown:', priceRoundedDown) // '5.99'
 * ```
 *
 * See also:
 *  * [append](/docs/append)
 *  * [defaultsDeep](/docs/defaultsDeep)
 *
 */
const callProp = (property, ...args) => function callingProp(object) {
  return object[property](...args)
}

module.exports = callProp
