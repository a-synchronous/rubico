const timeInLoop = require('./timeInLoop')
const isEqual = require('./isEqual')
const _ = require('lodash')

/**
 * @name isEqual
 *
 * @benchmark
 * isEqual(1, 1): 1e+6: 11.116ms
 * _.isEqual(1, 1): 1e+6: 5.394ms
 */

// timeInLoop('isEqual(1, 1)', 1e6, () => isEqual(1, 1))

const _isEqual = _.isEqual

// timeInLoop('_.isEqual(1, 1)', 1e6, () => _isEqual(1, 1))
