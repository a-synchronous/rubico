/**
 * @name SelfReferencingPromise
 *
 * @synopsis
 * ```coffeescript [specscript]
 * SelfReferencingPromise(basePromise Promise<T>) -> Promise<[T, basePromise]>
 * ```
 */
const SelfReferencingPromise = function (basePromise) {
  const promise = basePromise.then(res => [res, promise])
  return promise
}

module.exports = SelfReferencingPromise
