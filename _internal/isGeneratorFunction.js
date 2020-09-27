const objectToString = require('./objectToString')

const generatorFunctionTag = '[object GeneratorFunction]'

/**
 * @name isGeneratorFunction
 *
 * @synopsis
 * isGeneratorFunction(value any) -> boolean
 *
 * @description
 * Determine whether a value is a generator function.
 */
const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

module.exports = isGeneratorFunction
