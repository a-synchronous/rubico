export = promiseObjectAll;
/**
 * @name promiseObjectAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * promiseObjectAll(object<Promise|any>) -> Promise<object>
 * ```
 *
 * @description
 * Like `Promise.all` but for objects.
 */
declare function promiseObjectAll(object: any): any;
