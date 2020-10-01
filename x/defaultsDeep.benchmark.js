const timeInLoop = require('./timeInLoop')
const defaultsDeep = require('./defaultsDeep')
const _ = require('lodash')

/*
 * @name defaultsDeep
 *
 * @benchmark
 * ~2020-05-01
 * _.defaultsDeep: 1e+5: 94.124ms
 * defaultsDeep: 1e+5: 50.766ms
 * defaultsDeepFullInit: 1e+5: 52.048ms
 *
 * richytong - 2020-10-01
 * _.defaultsDeep: 1e+5: 96.245ms
 * defaultsDeep: 1e+5: 31.046ms
 * defaultsDeepFullInit: 1e+5: 35.69ms
 */

const defaultCollection = { b: 2, c: [3], d: [[{ e: 5 }]] }

const value = { a: 1 }

const _defaultsDeep = _.defaultsDeep

const defaultsDeepRubico = defaultsDeep(defaultCollection)

// console.log(defaultsDeep(defaultCollection)(value))
// console.log(_.defaultsDeep(defaultCollection, value))

// timeInLoop('_.defaultsDeep', 1e5, () => _defaultsDeep(defaultCollection, value))

// timeInLoop('defaultsDeep', 1e5, () => defaultsDeepRubico(value))

// timeInLoop('defaultsDeepFullInit', 1e5, () => defaultsDeep(defaultCollection)(value))
