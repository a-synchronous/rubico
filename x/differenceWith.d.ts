export = differenceWith;
/**
 * @name differenceWith
 *
 * @synopsis
 * ```coffeescript [specscript]
 * differenceWith(
 *   comparator (any, any)=>Promise|boolean,
 *   allValues Array,
 * )(values Array) -> someOrAllValues Array
 * ```
 *
 * @description
 * Create an array of all the values in an array that are not in another array as dictated by a comparator.
 *
 * ```javascript [playground]
 * import differenceWith from 'https://unpkg.com/rubico/dist/x/differenceWith.es.js'
 * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
 *
 * console.log(
 *   differenceWith(isDeepEqual, [{ a: 1 }, { b: 2 }, { c: 3 }])([{ b: 2 }]),
 * ) // [{ a: 1 }, { c: 3 }]
 * ```
 */
declare function differenceWith(comparator: any, allValues: any): (values: any) => any;
