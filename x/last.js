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
const last = x => {
  if (x == null) return undefined
  const length = x.length
  return length ? x[length - 1] : undefined
}

module.exports = last
