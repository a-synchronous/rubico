const FilteringAsyncIterator = require('./FilteringAsyncIterator')

/**
 * @name asyncGeneratorFunctionFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncGeneratorFunctionFilter<
 *   T any,
 *   args ...any,
 *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
 *   predicate T=>Promise|boolean,
 * >(asyncGeneratorFunction, predicate)
 *   -> filteringAsyncGeneratorFunction ...args=>AsyncGenerator<T>
 * ```
 *
 * @description
 * Filter an async generator function by predicate. Predicate may be asynchronous, in which case its evaluation is awaited.
 */
const asyncGeneratorFunctionFilter = (
  asyncGeneratorFunction, predicate,
) => async function* filteringAsyncGeneratorFunction(...args) {
  yield* FilteringAsyncIterator(asyncGeneratorFunction(...args), predicate)
}

module.exports = asyncGeneratorFunctionFilter
