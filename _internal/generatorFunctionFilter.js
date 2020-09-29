const FilteringIterator = require('./FilteringIterator')

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
  yield* FilteringIterator(generatorFunction(...args), predicate)
}

module.exports = generatorFunctionFilter
