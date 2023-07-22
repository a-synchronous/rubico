export = arrayConditional;
/**
 * @name arrayConditional
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayConditional(
 *   array Array<function|value>,
 *   args Array,
 *   funcsIndex number,
 * ) -> Promise|any
 * ```
 *
 * @description
 * Conditional operator `a ? b : c ? d : e ? ...` for functions.
 *
 * @TODO isPromise conditional await
 * @TODO benchmark vs regular promise handling
 */
declare function arrayConditional(array: any, args: any, funcsIndex: any): any;
