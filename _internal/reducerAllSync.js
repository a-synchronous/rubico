/**
 * @name reducerAllSync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerAllSync(predicate any=> boolean, result boolean, element any) -> boolean
 * ```
 */
const reducerAllSync = (predicate, result, element) => result ? predicate(element) : false

module.exports = reducerAllSync
