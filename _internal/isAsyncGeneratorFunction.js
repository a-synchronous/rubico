const objectToString = require('./objectToString')

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

/**
 * @name isAsyncGeneratorFunction
 *
 * @synopsis
 * isAsyncGeneratorFunction(value any) -> boolean
 *
 * @description
 * Determine whether a value is an async generator function.
 */
const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

module.exports = isAsyncGeneratorFunction
