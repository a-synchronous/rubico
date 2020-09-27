/**
 * @name callPropBinary
 *
 * @synopsis
 * ```coffeescript [specscript]
 * callPropBinary(
 *   value object,
 *   property string,
 *   arg0 any,
 *   arg1 any,
 * ) -> value[property](arg0, arg1)
 * ```
 *
 * @description
 * Call a property function on a value with two arguments.
 */
const callPropBinary = (value, property, arg0, arg1) => value[property](arg0, arg1)

module.exports = callPropBinary
