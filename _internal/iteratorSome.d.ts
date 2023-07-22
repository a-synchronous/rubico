export = iteratorSome;
/**
 * @name iteratorSome
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorSome(
 *   iterator Iterator,
 *   predicate any=>Promise|boolean,
 * ) -> boolean
 * ```
 */
declare function iteratorSome(iterator: any, predicate: any): boolean | Promise<boolean>;
