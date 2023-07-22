export = FilteringIterator;
/**
 * @name FilteringIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * FilteringIterator<
 *   T any,
 *   iterator Iterator<T>,
 *   predicate T=>boolean, # no async
 * >(iterator, predicate) -> filteringIterator Iterator<T>
 *
 * filteringIterator.next() -> { value: T, done: boolean }
 * ```
 *
 * @description
 * Creates a filtering iterator, i.e. an iterator that filteres a source iterator by predicate.
 */
declare function FilteringIterator(iterator: any, predicate: any): {
    [x: number]: () => {
        [x: number]: any;
        next(): any;
    };
    next(): any;
};
