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
const first = x => x != null ? x[0] : undefined

module.exports = first
