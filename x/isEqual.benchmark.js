const timeInLoop = require('./timeInLoop')
const isEqual = require('./isEqual')
const _ = require('lodash')

/**
 * @name isEqual
 *
 * @benchmark
 * isEqual(1, 1): 1e+6: 4.253ms
 * _.isEqual(1, 1): 1e+6: 5.162ms
 *
 * isEqual(1, 2): 1e+6: 4.183ms
 * _.isEqual(1, 2): 1e+6: 5.894ms
 */

const _isEqual = _.isEqual

// timeInLoop('isEqual(1, 1)', 1e6, () => isEqual(1, 1))

// timeInLoop('_.isEqual(1, 1)', 1e6, () => _isEqual(1, 1))

// timeInLoop('isEqual(1, 2)', 1e6, () => isEqual(1, 2))

// timeInLoop('_.isEqual(1, 2)', 1e6, () => _isEqual(1, 2))
