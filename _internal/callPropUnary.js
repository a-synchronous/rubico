/**
 * @name callPropUnary
 *
 * @synopsis
 * ```coffeescript [specscript]
 * callPropUnary(
 *   value object,
 *   property string,
 *   arg0 any,
 * ) -> value[property](arg0)
 * ```
 *
 * @description
 * Call a property function on a value with a single argument.
 */
const callPropUnary = (value, property, arg0) => value[property](arg0)

module.exports = callPropUnary
