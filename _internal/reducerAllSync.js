/**
 * @name reducerAllSync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerAllSync(predicate any=> boolean, result boolean, item any) -> boolean
 * ```
 */
const reducerAllSync = (predicate, result, item) => result ? predicate(item) : false

module.exports = reducerAllSync
