const objectToString = require('./objectToString')
const asyncGeneratorFunctionTag = require('./asyncGeneratorFunctionTag')

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
