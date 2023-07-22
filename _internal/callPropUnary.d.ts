export = callPropUnary;
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
declare function callPropUnary(value: any, property: any, arg0: any): any;
