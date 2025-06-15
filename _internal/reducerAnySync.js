/**
 * @name reducerAnySync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerAnySync(predicate T=>boolean) -> anyReducer (any, any)=>any
 * ```
 */
const reducerAnySync = predicate => function anyReducer(result, element) {
  return result ? true : predicate(element)
}

module.exports = reducerAnySync
