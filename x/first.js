const PossiblePromise = require('../monad/possible-promise')
const isString = require('./isString')

/*
 * @synopsis
 * first(x Promise<string>|string) -> firstChar string
 *
 * first(x Promise<Array>|Array) -> firstItem any
 */
const first = PossiblePromise.args(x => {
  if (Array.isArray(x) || isString(x)) return x[0]
  throw new TypeError('first(x); x is not an Array or String')
})

module.exports = first
