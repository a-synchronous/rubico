const funcConcatSync = require('./funcConcatSync')
const curry3 = require('./curry3')
const __ = require('./placeholder')
const iteratorReduce = require('./iteratorReduce')

/**
 * @name generatorFunctionReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * generatorFunctionReduce<
 *   T any,
 *   args ...any,
 *   generatorFunction ...args=>Generator<Promise|T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * >(generatorFunction, reducer, result)
 *   -> reducingFunction ...args=>Promise|result
 * ```
 *
 * @description
 * Execute a reducer for each item of a generator function, returning a single value.
 */
const generatorFunctionReduce = (
  generatorFunction, reducer, result,
) => funcConcatSync(
  generatorFunction,
  curry3(iteratorReduce, __, reducer, result))

module.exports = generatorFunctionReduce
