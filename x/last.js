const PossiblePromise = require('../monad/PossiblePromise')
const Instance = require('../monad/Instance')

const { isArray, isString } = Instance

const possiblePromiseArgs = PossiblePromise.args

/*
 * @name
 * last
 *
 * @synopsis
 * last(value Promise<string>|string) -> lastChar string
 *
 * last(value Promise<Array>|Array) -> lastItem any
 *
 * @catchphrase
 * Get the last item from a string or Array
 */
const last = value => {
  if (value == null) return undefined
  const length = value.length
  return length ? value[length - 1] : undefined
}

module.exports = last
