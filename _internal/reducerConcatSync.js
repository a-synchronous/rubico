/**
 * @name reducerConcatSync
 *
 * @synopsis
 * reducerConcatSync(
 *   reducerA (any, T)=>(intermediate any),
 *   reducerB (intermediate, T)=>any,
 * ) -> pipedReducer (any, T)=>any
 */
const reducerConcatSync = (
  reducerA, reducerB,
) => function pipedReducer(result, element) {
  return reducerB(reducerA(result, element), element)
}

module.exports = reducerConcatSync
