export = FlatMappingIterator;
/**
 * @name FlatMappingIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * FlatMappingIterator(
 *   iterator Iterator, flatMapper function,
 * ) -> FlatMappingIterator { next, SymbolIterator }
 * ```
 */
declare function FlatMappingIterator(iterator: any, flatMapper: any): {
    [x: number]: () => any;
    next(): any;
};
