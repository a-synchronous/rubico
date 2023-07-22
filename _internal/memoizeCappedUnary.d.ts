export = memoizeCappedUnary;
/**
 * @name memoizeCappedUnary
 *
 * @synopsis
 * ```coffeescript [specscript]
 * memoizeCappedUnary(func function, cap number) -> memoized function
 * ```
 *
 * @description
 * Memoize a function. Clear cache when size reaches cap.
 *
 * @todo explore Map reimplementation
 */
declare function memoizeCappedUnary(func: any, cap: any): {
    (arg0: any): any;
    cache: any;
};
