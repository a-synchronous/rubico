const isPromise = require('./isPromise')

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
  for await (const item of asyncGeneratorFunction(...args)) {
    const shouldIncludeItem = predicate(item)
    if (
      isPromise(shouldIncludeItem)
        ? await shouldIncludeItem
        : shouldIncludeItem
    ) {
      yield item
    }
  }
}

module.exports = asyncGeneratorFunctionFilter
