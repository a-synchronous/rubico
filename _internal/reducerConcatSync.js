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
) => function pipedReducer(result, item) {
  return reducerB(reducerA(result, item), item)
}

module.exports = reducerConcatSync
