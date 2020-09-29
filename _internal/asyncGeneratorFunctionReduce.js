const funcConcatSync = require('./funcConcatSync')
const asyncIteratorReduce = require('./asyncIteratorReduce')
const __ = require('./placeholder')
const curry3 = require('./curry3')

/**
 * @name asyncGeneratorFunctionReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncGeneratorFunctionReduce(
 *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
 *   reducer (any, T)=>any,
 *   result any,
 * ) -> (...any args)=>any
 * ```
 */
const asyncGeneratorFunctionReduce = (
  asyncGeneratorFunction, reducer, result,
) => funcConcatSync(
  asyncGeneratorFunction,
  curry3(asyncIteratorReduce, __, reducer, result))

module.exports = asyncGeneratorFunctionReduce
