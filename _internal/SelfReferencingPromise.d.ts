export = SelfReferencingPromise;
/**
 * @name SelfReferencingPromise
 *
 * @synopsis
 * ```coffeescript [specscript]
 * SelfReferencingPromise(basePromise Promise<T>) -> Promise<[T, basePromise]>
 * ```
 */
declare function SelfReferencingPromise(basePromise: any): any;
