export = FilteringAsyncIterator;
/**
 * @name FilteringAsyncIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * const filteringAsyncIterator = new FilteringAsyncIterator(
 *   asyncIterator AsyncIterator<T>,
 *   predicate T=>boolean,
 * ) -> FilteringAsyncIterator<T>
 *
 * filteringAsyncIterator.next() -> { value: Promise, done: boolean }
 * ```
 */
declare function FilteringAsyncIterator(asyncIterator: any, predicate: any): {
    [x: number]: () => {
        [x: number]: any;
        isAsyncIteratorDone: boolean;
        next(): Promise<{
            value: any;
            done: boolean;
        }>;
    };
    isAsyncIteratorDone: boolean;
    next(): Promise<{
        value: any;
        done: boolean;
    }>;
};
