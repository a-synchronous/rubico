const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')
const _ = require('lodash')
const R = require('ramda')

/**
 * @name gte
 *
 * @benchmark
 * rubico.gte(1, 0): 1e+7: 12.529ms
 * _.gte(1, 0): 1e+7: 13.886ms
 * R.gte(1, 0): 1e+7: 18.766ms
 */

const rubicoGte = rubico.gte(1, 0)

// console.log(rubicoGte())
// console.log(_.gte(1, 0))
// console.log(R.gte(1, 0))

// timeInLoop('rubico.gte(1, 0)', 1e7, () => rubicoGte())

// timeInLoop('_.gte(1, 0)', 1e7, () => _.gte(1, 0))

// timeInLoop('R.gte(1, 0)', 1e7, () => R.gte(1, 0))
