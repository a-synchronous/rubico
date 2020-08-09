const timeInLoop = require('../x/timeInLoop')
const last = require('./last')
const _ = require('lodash')
const R = require('ramda')

const arr = [1, 2, 3]

/**
 * @name last
 *
 * @benchmark
 * last(arr): 1e+6: 10.05ms
 * _.last(arr): 1e+6: 5.239ms
 * R.last(arr): 1e+6: 514.98ms
 */

// timeInLoop('last(arr)', 1e6, () => last(arr))

const _last = _.last

// timeInLoop('_.last(arr)', 1e6, () => _last(arr))

const RLast = R.tail

// timeInLoop('R.last(arr)', 1e6, () => RLast(arr))
