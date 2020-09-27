const PossiblePromise = require('../monad/PossiblePromise')
const Instance = require('../monad/Instance')

const { isArray, isString } = Instance

const possiblePromiseArgs = PossiblePromise.args

/**
 * @name first
 *
 * @synopsis
 * ```coffeescript [specscript]
 * first(value any) -> value[0]
 * ```
 *
 * @description
 * Get the first item of a value
 */
const first = value => value == null ? undefined : value[0]

module.exports = first
