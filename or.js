const isPromise = require('./_internal/isPromise')
const curry3 = require('./_internal/curry3')
const __ = require('./_internal/placeholder')

/**
 * @name asyncOr
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncOr(
 *   predicates Array<value=>Promise|boolean>
 *   value any,
 * ) -> allTruthy boolean
 * ```
 */
const asyncOr = async function (predicates, value) {
  const length = predicates.length
  let index = -1
  while (++index < length) {
    let predication = predicates[index](value)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return true
    }
  }
  return false
}

// handles the first predication before asyncOr
const _asyncOrInterlude = (
  predicates, value, firstPredication,
) => firstPredication ? true : asyncOr(predicates, value)

/**
 * @name or
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value any,
 *   predicates Array<value=>Promise|boolean>
 *
 * or(predicates)(value) -> Promise|boolean
 * ```
 *
 * @description
 * Test an array of predicates concurrently against a single input, returning true if any of them test truthy.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const isEven = number => number % 2 == 0
 *
 * console.log(
 *   or([isOdd, isEven])(0),
 * ) // true
 * ```
 *
 * @execution series
 *
 * @note ...args slows down here by an order of magnitude
 */
const or = predicates => function anyPredicates(value) {
  if (value != null && typeof value.or == 'function') {
    return value.or(predicates)
  }
  const length = predicates.length
  let index = -1

  while (++index < length) {
    const predication = predicates[index](value)
    if (isPromise(predication)) {
      return predication.then(curry3(_asyncOrInterlude, predicates, value, __))
    }
    if (predication) {
      return true
    }
  }
  return false
}

module.exports = or
