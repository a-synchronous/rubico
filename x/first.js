const PossiblePromise = require('../monad/PossiblePromise')
const Instance = require('../monad/Instance')

const { isArray, isString } = Instance

const possiblePromiseArgs = PossiblePromise.args

/*
 * @name
 * first
 *
 * @synopsis
 * first(x Promise<string>|string) -> firstChar string
 *
 * first(x Promise<Array>|Array) -> firstItem any
 *
 * @catchphrase
 * Get the first item from an orderable collection
 */
const first = possiblePromiseArgs(x => {
  if (x != null && x.length != 0) return x[0]
  throw new TypeError('first(x); x is not an Array or String')
})

module.exports = first
