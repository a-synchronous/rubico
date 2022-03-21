const filter = require('../filter')
const not = require('../not')

/**
 * @name filterOut
 *
 * @synopsis
 * ```coffeescript [specscript]
 * filterOut(
 *   arrayPredicate (value any, index number, array Array)=>Promise|boolean
 * )(array) -> rejectedArray Promise|Array
 *
 * filterOut(
 *   objectPredicate (value any, key string, object Object)=>Promise|boolean
 * )(object) -> rejectedObject Promise|Object
 *
 * filterOut(
 *   setPredicate (value any, value, set Set)=>Promise|boolean
 * )(set) -> rejectedSet Promise|Set
 *
 * filterOut(
 *   mapPredicate (value any, key any, map Map)=>Promise|boolean
 * )(map) -> rejectedMap Promise|Map
 *
 * filterOut(
 *   predicate (value any)=>Promise|boolean
 * )(generatorFunction GeneratorFunction) -> rejectingGeneratorFunction GeneratorFunction
 *
 * filterOut(
 *   predicate (value any)=>Promise|boolean
 * )(asyncGeneratorFunction AsyncGeneratorFunction) -> rejectingAsyncGeneratorFunction AsyncGeneratorFunction
 *
 * filterOut(
 *   predicate (value any)=>Promise|boolean
 * )(reducer Reducer) -> rejectingReducer Reducer
 * ```
 *
 * @description
 * The inverse of `filter`. Values that test true by the predicate are filtered out, or "rejected".
 */
const filterOut = predicate => filter(not(predicate))

module.exports = filterOut
