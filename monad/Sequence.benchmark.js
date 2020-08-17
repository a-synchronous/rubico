const timeInLoop = require('../x/timeInLoop')

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = value => nativeObjectToString.call(value)

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const generatorFunctionTag = '[object GeneratorFunction]'

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const isGeneratorFunction = value => {
  const tag = objectToString(value)
  return tag == generatorFunctionTag || tag == asyncGeneratorFunctionTag
}

/*
 * @name Sequence.isSequence
 *
 * @benchmark
 * isSequence1([]): 1e+8: 103.083ms
 * isSequence2([]): 1e+8: 102.643ms
 */

const isSequence1 = value => value != null
  && (Boolean(value[symbolIterator])
    || Boolean(value[symbolAsyncIterator])
    || isGeneratorFunction(value))

const isSequence2 = value => value != null
  && (typeof value[symbolIterator] == 'function'
    || typeof value[symbolAsyncIterator] == 'function'
    || isGeneratorFunction(value))

// timeInLoop('isSequence1([])', 1e8, () => isSequence1([]))

// timeInLoop('isSequence2([])', 1e8, () => isSequence2([]))
