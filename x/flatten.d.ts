export = flatten;
/**
 * @name flatten
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream<T> = { read: ()=>T, write: T=>() }
 * Monad<T> = Array<T>|String<T>|Set<T>
 *   |TypedArray<T>|Stream<T>|Iterator<T>|AsyncIterator<T>
 *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T>=>any }|Object<T>
 *
 * var T any,
 *   monad Monad<Monad<T>|Foldable<T>|T>,
 *   args ...any,
 *   generatorFunction ...args=>Generator<Monad<T>|Foldable<T>|T>,
 *   asyncGeneratorFunction ...args=>AsyncGenerator<Monad<T>|Foldable<T>|T>,
 *   reducer Reducer<Monad<T>|Foldable<T>|T>
 *
 * flatten(monad) -> Monad<T>
 *
 * flatten(generatorFunction) -> ...args=>Generator<T>
 *
 * flatten(asyncGeneratorFunction) -> ...args=>AsyncGenerator<T>
 *
 * flatten(reducer) -> Reducer<T>
 * ```
 *
 * @description
 * Flatten a collection. Works in transducer position.
 *
 * ```javascript [playground]
 * import flatten from 'https://unpkg.com/rubico/dist/x/flatten.es.js'
 *
 * flatten([
 *   [1, 1],
 *   new Set([2, 2]),
 *   (function* () { yield 3; yield 3 })(),
 *   (async function* () { yield 4; yield 4 })(),
 *   { a: 5, b: 5 },
 *   6,
 *   Promise.resolve(7),
 *   new Uint8Array([8]),
 * ]).then(console.log)
 * // [1, 1, 2, 3, 3, 5, 5, 6, 7, 8, 4, 4]
 *
 * const add = (a, b) => a + b
 *
 * console.log(
 *   [[1], [2], [3], [4], [5]].reduce(flatten(add), 0),
 * ) // 15
 * ```
 *
 * @TODO flatten for each type
 */
declare function flatten(value: any): any;
