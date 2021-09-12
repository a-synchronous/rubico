/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const noop = function () {}

const isPromise = value => value != null && typeof value.then == 'function'

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

const funcConcatSync = (
  funcA, funcB,
) => function pipedFunction(...args) {
  return funcB(funcA(...args))
}

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = value => nativeObjectToString.call(value)

const generatorFunctionTag = '[object GeneratorFunction]'

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const pipe = function (funcs) {
  let functionPipeline = noop,
    functionComposition = noop
  return function pipeline(...args) {
    const firstArg = args[0]
    if (
      typeof firstArg == 'function'
        && !isGeneratorFunction(firstArg)
        && !isAsyncGeneratorFunction(firstArg)
    ) {
      if (functionComposition == noop) {
        functionComposition = funcs.reduceRight(funcConcat)
      }
      return functionComposition(...args)
    }
      if (functionPipeline == noop) {
        functionPipeline = funcs.reduce(funcConcat)
      }
    return functionPipeline(...args)
  }
}

// funcs Array<function> -> pipeline function
const pipeSync = funcs => funcs.reduce(funcConcatSync)

pipe.sync = pipeSync

export default pipe
