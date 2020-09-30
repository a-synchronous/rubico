const timeInLoop = require('./timeInLoop')
const find = require('./find')
const R = require('ramda')
const _ = require('lodash')

/**
 * @name find
 *
 * @benchmark
 * find(gt0)(array): 1e+6: 13.627ms
 * R.find(gt0, array): 1e+6: 94.086ms
 * gt0_findLodashHappyPath: 1e+6: 80.071ms
 */

const gt0 = x => x > 0

const array = [1, 2, 3]

// console.log(find(gt0)(array))
// console.log(R.find(gt0, array))
// console.log(_.find(array, gt0))

// timeInLoop('find(gt0)(array)', 1e6, () => { find(gt0)(array) })

// timeInLoop('R.find(gt0, array)', 1e6, () => { R.find(gt0, array) })

// timeInLoop('_.find(array, gt0)', 1e6, () => { _.find(array, gt0) })
