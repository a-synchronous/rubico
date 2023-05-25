const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')
const _ = require('lodash')
const R = require('ramda')

/**
 * @name gt
 *
 * @benchmark
 * rubico.gt(0, 0): 1e+7: 12.52ms
 * _.gt(0, 0): 1e+7: 13.934ms
 * R.gt(1, 0): 1e+7: 18.437ms
 */

const rubicoGt = rubico.gt(1, 0)

// console.log(rubicoGt())
// console.log(_.gt(1, 0))
// console.log(R.gt(1, 0))

// timeInLoop('rubico.gt(1, 0)', 1e7, () => rubicoGt())

// timeInLoop('_.gt(1, 0)', 1e7, () => _.gt(1, 0))

// timeInLoop('R.gt(1, 0)', 1e7, () => R.gt(1, 0))
