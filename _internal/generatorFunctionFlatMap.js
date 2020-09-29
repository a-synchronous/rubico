const FlatMappingIterator = require('./FlatMappingIterator')

/**
 * @name generatorFunctionFlatMap
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
 * generatorFunctionFlatMap<
 *   T any,
 *   args ...any,
 *   generatorFunction ...args=>Generator<Promise|T>,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * >(generatorFunction, flatMapper) ->
 *   flatMappingGeneratorFunction ...args=>Generator<Promise|T>
 * ```
 */
const generatorFunctionFlatMap = (
  generatorFunction, flatMapper,
) => function* flatMappingGeneratorFunction(...args) {
  yield* FlatMappingIterator(generatorFunction(...args), flatMapper)
}

module.exports = generatorFunctionFlatMap
