const timeInLoop = require('./timeInLoop')
const defaultsDeep = require('./defaultsDeep')
const _ = require('lodash')

/*
 * @name defaultsDeep
 *
 * @benchmark
 * _.defaultsDeep: 1e+5: 94.124ms
 * defaultsDeep: 1e+5: 50.766ms
 */

const defaultCollection = { b: 2, c: [3], d: [[{ e: 5 }]] }

const value = { a: 1 }

const _defaultsDeep = _.defaultsDeep

// timeInLoop('_.defaultsDeep', 1e5, () => _defaultsDeep(defaultCollection, value))

const defaultsDeepRubico = defaultsDeep(defaultCollection)

// timeInLoop('defaultsDeep', 1e5, () => defaultsDeepRubico(value))
