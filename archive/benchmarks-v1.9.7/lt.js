const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')
const _ = require('lodash')
const R = require('ramda')

/**
 * @name lt
 *
 * @benchmark
 * rubico.lt(1, 0): 1e+7: 12.514ms
 * _.lt(1, 0): 1e+7: 14.042ms
 * R.lt(1, 0): 1e+7: 18.409ms
 */

const rubicoLt = rubico.lt(1, 0)

// console.log(rubicoLt())
// console.log(_.lt(1, 0))
// console.log(R.lt(1, 0))

// timeInLoop('rubico.lt(1, 0)', 1e7, () => rubicoLt())

// timeInLoop('_.lt(1, 0)', 1e7, () => _.lt(1, 0))

// timeInLoop('R.lt(1, 0)', 1e7, () => R.lt(1, 0))
