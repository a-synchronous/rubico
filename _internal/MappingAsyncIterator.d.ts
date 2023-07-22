export = MappingAsyncIterator;
/**
 * @name MappingAsyncIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mappingAsyncIterator = new MappingAsyncIterator(
 *   asyncIter AsyncIterator<T>,
 *   mapper T=>Promise|any,
 * ) -> mappingAsyncIterator AsyncIterator
 *
 * mappingAsyncIterator.next() -> Promise<{ value: any, done: boolean }>
 * ```
 */
declare function MappingAsyncIterator(asyncIterator: any, mapper: any): {
    [x: number]: () => {
        [x: number]: any;
        next(): Promise<any>;
    };
    next(): Promise<any>;
};
