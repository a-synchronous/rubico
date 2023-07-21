const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')
const _ = require('lodash')
const R = require('ramda')

/**
 * @name lte
 *
 * @benchmark
 * rubico.lte(1, 0): 1e+7: 12.537ms
 * _.lte(1, 0): 1e+7: 14.026ms
 * R.lte(1, 0): 1e+7: 17.259ms
 */

const rubicoLte = rubico.lte(1, 0)

// console.log(rubicoLte())
// console.log(_.lte(1, 0))
// console.log(R.lte(1, 0))

// timeInLoop('rubico.lte(1, 0)', 1e7, () => rubicoLte())

// timeInLoop('_.lte(1, 0)', 1e7, () => _.lte(1, 0))

// timeInLoop('R.lte(1, 0)', 1e7, () => R.lte(1, 0))
