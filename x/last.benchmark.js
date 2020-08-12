const timeInLoop = require('../x/timeInLoop')
const last = require('./last')
const _ = require('lodash')
const R = require('ramda')

const arr = [1, 2, 3]

/**
 * @name last
 *
 * @benchmark
 * last(arr): 1e+6: 5.154ms
 * _.last(arr): 1e+6: 5.191ms
 * R.last(arr): 1e+6: 518.671ms
 *
 * last([]): 1e+6: 5.204ms
 * _.last([]): 1e+6: 5.468ms
 * R.last([]): 1e+6: 498.638ms
 *
 * last('hey'): 1e+6: 5.776ms
 * _.last('hey'): 1e+6: 6.1ms
 * R.last('hey'): 1e+6: 813.653ms
 *
 * last(''): 1e+6: 3.975ms
 * _.last(''): 1e+6: 4.306ms
 * R.last(''): 1e+6: 785.416ms
 *
 * last(null): 1e+6: 3.626ms
 * _.last(null): 1e+6: 4.121ms
 * R.last(null): TypeError
 */

const _last = _.last

const RLast = R.tail

// timeInLoop('last(arr)', 1e6, () => last(arr))

// timeInLoop('_.last(arr)', 1e6, () => _last(arr))

// timeInLoop('R.last(arr)', 1e6, () => RLast(arr))

// timeInLoop('last([])', 1e6, () => last([]))

// timeInLoop('_.last([])', 1e6, () => _last([]))

// timeInLoop('R.last([])', 1e6, () => RLast([]))

// timeInLoop('last(\'hey\')', 1e6, () => last('hey'))

// timeInLoop('_.last(\'hey\')', 1e6, () => _last('hey'))

// timeInLoop('R.last(\'hey\')', 1e6, () => RLast('hey'))

// timeInLoop('last(\'\')', 1e6, () => last(''))

// timeInLoop('_.last(\'\')', 1e6, () => _last(''))

// timeInLoop('R.last(\'\')', 1e6, () => RLast(''))

// timeInLoop('last(null)', 1e6, () => last(null))

// timeInLoop('_.last(null)', 1e6, () => _last(null))

// timeInLoop('R.last(null)', 1e6, () => RLast(null))
