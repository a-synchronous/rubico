/**
 * @name generatorFunctionMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * generatorFunctionMap<
 *   T any,
 *   args ...any,
 *   generatorFunc ...args=>Generator<T>,
 *   mapper T=>any,
 * >(generatorFunc, mapper) -> mappingGeneratorFunc ...args=>Generator
 * ```
 *
 * @description
 * Create a mapping generator function from a generator function and a mapper. A mapping generator function produces mapping generators that apply the mapper to each item of the original generator.
 *
 * @TODO playground example
 */
const generatorFunctionMap = (
  generatorFunc, mapper,
) => function* mappingGeneratorFunc(...args) {
  for (const item of generatorFunc(...args)) {
    yield mapper(item)
  }
}

module.exports = generatorFunctionMap
