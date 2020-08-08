const PossiblePromise = require('../monad/PossiblePromise')
const Flattenable = require('../monad/Flattenable')

const possiblePromiseArgs = PossiblePromise.args

const {
  isFlattenable,
  flatten: flattenableFlatten,
} = Flattenable

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
const flatten = possiblePromiseArgs(x => {
  if (isFlattenable(x)) return flattenableFlatten(x)
  throw new TypeError('flatten(x); x invalid')
})

module.exports = flatten
