const PossiblePromise = require('../monad/PossiblePromise')
const Flattenable = require('../monad/Flattenable')

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

module.exports = flatten
