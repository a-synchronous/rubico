/**
 * @name isPromise
 *
 * @synopsis
 * isPromise(value any) -> boolean
 *
 * @description
 * Determine whether a value is a promise.
 */
const isPromise = value => value != null && typeof value.then == 'function'

module.exports = isPromise
