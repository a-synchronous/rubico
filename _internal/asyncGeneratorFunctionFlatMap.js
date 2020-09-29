const FlatMappingAsyncIterator = require('./FlatMappingAsyncIterator')

/**
 * @name asyncGeneratorFunctionFlatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream<T> = { read: ()=>T, write: T=>() }
 * Monad<T> = Array<T>|String<T>|Set<T>
 *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
 *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
 *
 * asyncGeneratorFunctionFlatMap<
 *   T any,
 *   args ...any,
 *   asyncGeneratorFunction ...args=>Generator<Promise<T>>,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * >(asyncGeneratorFunction, flatMapper) ->
 *   flatMappingAsyncGeneratorFunction ...args=>Generator<Promise<T>>
 * ```
 */
const asyncGeneratorFunctionFlatMap = (
  asyncGeneratorFunction, flatMapper,
) => async function* flatMappingAsyncGeneratorFunction(...args) {
  yield* FlatMappingAsyncIterator(asyncGeneratorFunction(...args), flatMapper)
}

module.exports = asyncGeneratorFunctionFlatMap
