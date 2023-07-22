export = FlatMappingAsyncIterator;
/**
 * @name FlatMappingAsyncIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new FlatMappingAsyncIterator(
 *   asyncIterator AsyncIterator, flatMapper function,
 * ) -> FlatMappingAsyncIterator AsyncIterator
 * ```
 *
 * @execution concurrent
 *
 * @muxing
 */
declare function FlatMappingAsyncIterator(asyncIterator: any, flatMapper: any): {
    [x: number]: () => any;
    isAsyncIteratorDone: boolean;
    toString(): string;
    /**
     * @name FlatMappingAsyncIterator.prototype.next
     *
     * @synopsis
     * ```coffeescript [specscript]
     * new FlatMappingAsyncIterator(
     *   asyncIterator AsyncIterator, flatMapper function,
     * ).next() -> Promise<{ value, done }>
     * ```
     */
    next(): Promise<{
        value: any;
        done: boolean;
    }>;
};
