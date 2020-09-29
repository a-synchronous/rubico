/**
 * @name reducerAnySync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerAnySync(predicate T=>boolean) -> anyReducer (any, any)=>any
 * ```
 */
const reducerAnySync = predicate => function anyReducer(result, item) {
  return result ? true : predicate(item)
}

module.exports = reducerAnySync
