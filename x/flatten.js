const PossiblePromise = require('../monad/possible-promise')
const Instance = require('../monad/instance')

const objectValuesIterator = function*(x) {
  for (const k in x) {
    yield x[k]
  }
}

const Flattenable = {}

/*
 * @synopsis
 * Flattenable.isFlattenable(x any) -> boolean
 */
Flattenable.isFlattenable = x => (Instance.isInstance(x)
  && Instance.isArray(x) || Instance.isSet(x))

// Flattenable.isFlattenable = x => isInstance(x) && isArray(x) || isSet(x)

/*
 * @synopsis
 * <T any>genericFlatten(
 *   method string,
 *   y Array,
 *   x Array<Iterable<T>|Object<T>|T>,
 * ) -> y Array<T>
 *
 * <T any>genericFlatten(
 *   method string,
 *   y Set,
 *   x Set<Iterable<T>|Object<T>|T>,
 * ) -> y Set<T>
 */
const genericFlatten = (method, y, x) => {
  const add = y[method].bind(y)
  for (const xi of x) {
    if (!Instance.isInstance(xi)) {
      add(xi)
    } else if (Instance.isIterable(xi)) {
      for (const v of xi) add(v)
    } else if (Instance.isObject(xi)) {
      for (const v of objectValuesIterator(xi)) add(v)
    } else {
      add(xi)
    }
  }
  return y
}

/*
 * @synopsis
 * Array|Set -> Flattenable
 *
 * <T any>Flattenable.flatten(
 *   x Flattenable<Iterable<T>|Object<T>|T>,
 * ) -> Array<T>
 */
// Flattenable.flatten = x => isArray(x) ? arrayFlatten(x) : setFlatten(x)
Flattenable.flatten = x => (Instance.isArray(x)
  ? genericFlatten('push', [], x)
  : genericFlatten('add', new Set(), x))

/*
 * @synopsis
 * <T any>flatten(
 *   x Array<Iterable<T>|Object<T>|T>,
 * ) -> Array<T>
 *
 * <T any>flatten(
 *   x Set<Iterable<T>|Object<T>|T>,
 * ) -> Set<T>
 */
const flatten = PossiblePromise.args(x => {
  if (Flattenable.isFlattenable(x)) return Flattenable.flatten(x)
  throw new TypeError('flatten(x); x invalid')
})

flatten.Flattenable = Flattenable

module.exports = flatten
