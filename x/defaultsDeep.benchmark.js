const timeInLoop = require('./timeInLoop')
const defaultsDeep = require('./defaultsDeep')
const _ = require('lodash')

/*
 * @name defaultsDeep
 *
 * @benchmark
 * _.defaultsDeep_happyPath: 1e+5: 94.109ms
 * rubico/x/defaultsDeep_fullInit: 1e+5: 71.265ms
 * rubico/x/defaultsDeep_happyPath: 1e+5: 59.862ms
 */

const defaultCollection = { b: 2, c: [3], d: [[{ e: 5 }]] }

const value = { a: 1 }

const _defaultsDeep = _.defaultsDeep

// timeInLoop('_.defaultsDeep_happyPath', 1e5, () => _defaultsDeep(defaultCollection, value))

// timeInLoop('rubico/x/defaultsDeep_fullInit', 1e5, () => defaultsDeep(defaultCollection)(value))

const defaultsDeepHappyPath = defaultsDeep(defaultCollection)

// timeInLoop('rubico/x/defaultsDeep_happyPath', 1e5, () => defaultsDeepHappyPath(value))
