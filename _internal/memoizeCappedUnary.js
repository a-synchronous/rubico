/**
 * @name memoizeCappedUnary
 *
 * @synopsis
 * ```coffeescript [specscript]
 * memoizeCappedUnary(func function, cap number) -> memoized function
 * ```
 *
 * @description
 * Memoize a function. Clear cache when size reaches cap.
 *
 * @todo explore Map reimplementation
 */
const memoizeCappedUnary = function (func, cap) {
  const cache = new Map(),
    memoized = function memoized(arg0) {
      if (cache.has(arg0)) {
        return cache.get(arg0)
      }
      const result = func(arg0)
      cache.set(arg0, result)
      if (cache.size > cap) {
        cache.clear()
      }
      return result
    }
  memoized.cache = cache
  return memoized
}

module.exports = memoizeCappedUnary
