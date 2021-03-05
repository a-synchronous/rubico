/**
 * @name callProp
 *
 * @synopsis
 * ```coffeescript [specscript]
 * callProp(property string, ...args)(object) -> object[property](...args)
 * ```
 *
 * @description
 * ```javascript [playground]
 * import callProp from 'https://unpkg.com/rubico/dist/x/callProp.es.js'
 *
 * const priceRoundedDown = callProp('toFixed', 2)(5.992)
 * console.log('priceRoundedDown', priceRoundedDown) // 5.99
 * ```
 */
const callProp = (property, ...args) => function callingProp(object) {
  return object[property](...args)
}

module.exports = callProp
