/**
 * @name generatorFunctionFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * generatorFunctionFilter<
 *   T any,
 *   args ...any,
 *   generatorFunction ...args=>Generator<T>,
 *   predicate T=>boolean,
 * >(generatorFunction, predicate)
 *   -> filteringGeneratorFunction ...args=>Generator
 * ```
 *
 * @description
 * Filter a generator function by predicate.
 *
 * Note: async predicates may beget unexpected results
 */
const generatorFunctionFilter = (
  generatorFunction, predicate,
) => function* filteringGeneratorFunction(...args) {
  for (const item of generatorFunction(...args)) {
    if (predicate(item)) {
      yield item
    }
  }
}

module.exports = generatorFunctionFilter
