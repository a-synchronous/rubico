/**
 * @name asyncGeneratorFunctionMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncGeneratorFunctionMap<
 *   T any,
 *   args ...any,
 *   asyncGeneratorFunc ...args=>AsyncGenerator<T>,
 *   mapper T=>Promise|any,
 * >(asyncGeneratorFunc, mapper)
 *   -> mappingAsyncGeneratorFunc ...args=>AsyncGenerator,
 * ```
 *
 * @description
 * Create a mapping async generator function from an async generator function and a mapper. A mapping async generator function produces async mapping generators that apply the mapper to each element of the original async generator.
 *
 * `mapper` may be asynchronous.
 *
 * @TODO isPromise optimization
 */
const asyncGeneratorFunctionMap = function (asyncGeneratorFunc, mapper) {
  return async function* mappingAsyncGeneratorFunc(...args) {
    for await (const element of asyncGeneratorFunc(...args)) {
      yield mapper(element)
    }
  }
}

module.exports = asyncGeneratorFunctionMap
