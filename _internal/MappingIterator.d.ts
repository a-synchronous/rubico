export = MappingIterator;
/**
 * @name MappingIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * MappingIterator<
 *   T any,
 *   iterator Iterator<T>,
 *   mapper T=>any,
 * >(iterator, mapper) -> mappingIterator Object
 *
 * mappingIterator.next() -> nextIteration { value: any, done: boolean }
 * ```
 *
 * @description
 * Creates a mapping iterator, i.e. an iterator that applies a mapper to each item of a source iterator.
 *
 * Note: consuming the mapping iterator also consumes the source iterator.
 */
declare function MappingIterator(iterator: any, mapper: any): {
    [x: number]: () => {
        [x: number]: any;
        toString(): string;
        next(): any;
    };
    toString(): string;
    next(): any;
};
