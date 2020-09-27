'use strict'

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = x => nativeObjectToString.call(x)

const generatorFunctionTag = '[object GeneratorFunction]'

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const isIterable = value => value != null
  && typeof value[symbolIterator] == 'function'

const isAsyncIterable = value => value != null
  && typeof value[symbolAsyncIterator] == 'function'

const Sequence = function (value) {
  if (value == null) {
    this.iterator = [][symbolIterator]()
  }
  // if (isGeneratorFunction(value)) {}
}

Sequence.prototype.next = function (value) {
  return this.iterator.next(value)
}
