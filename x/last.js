const PossiblePromise = require('../monad/PossiblePromise')
const Instance = require('../monad/Instance')

const { isArray, isString } = Instance

const possiblePromiseArgs = PossiblePromise.args

/*
 * @name
 * last
 *
 * @synopsis
 * last(x Promise<string>|string) -> lastChar string
 *
 * last(x Promise<Array>|Array) -> lastItem any
 *
 * @catchphrase
 * Get the last item from a string or Array
 */
const last = possiblePromiseArgs(x => {
  if (x != null && x.length != 0) return x[x.length - 1]
  throw new TypeError('last(x); x is not an Array or String')
})

module.exports = last
