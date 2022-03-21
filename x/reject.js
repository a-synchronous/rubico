const filter = require('../filter')
const not = require('../not')

/**
 * @name reject
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reject(
 *   arrayPredicate (value any, index number, array Array)=>Promise|boolean
 * )(array) -> rejectedArray Promise|Array
 *
 * reject(
 *   objectPredicate (value any, key string, object Object)=>Promise|boolean
 * )(object) -> rejectedObject Promise|Object
 *
 * reject(
 *   setPredicate (value any, value, set Set)=>Promise|boolean
 * )(set) -> rejectedSet Promise|Set
 *
 * reject(
 *   mapPredicate (value any, key any, map Map)=>Promise|boolean
 * )(map) -> rejectedMap Promise|Map
 *
 * reject(
 *   predicate (value any)=>Promise|boolean
 * )(generatorFunction GeneratorFunction) -> rejectingGeneratorFunction GeneratorFunction
 *
 * reject(
 *   predicate (value any)=>Promise|boolean
 * )(asyncGeneratorFunction AsyncGeneratorFunction) -> rejectingAsyncGeneratorFunction AsyncGeneratorFunction
 *
 * reject(
 *   predicate (value any)=>Promise|boolean
 * )(reducer Reducer) -> rejectingReducer Reducer
 * ```
 *
 * @description
 * The inverse of `filter`. Values that test true by the predicate are filtered out, or "rejected".
 */
const reject = predicate => filter(not(predicate))

module.exports = reject
