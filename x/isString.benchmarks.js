const timeInLoop = require('../x/timeInLoop')
const isString = require('./isString')
const _ = require('lodash')

/**
 * @name isString
 *
 * @benchmark
 * isString({}): 1e+7: 15.017ms
 * _.isString({}): 1e+7: 418.155ms
 * isString([]): 1e+7: 14.653ms
 * _.isString([]): 1e+7: 15.373ms
 * isString('hey'): 1e+7: 12.794ms
 * _.isString('hey'): 1e+7: 12.904ms
 * isString(null): 1e+7: 13.342ms
 * _.isString(null): 1e+7: 13.878ms
 */

const _isString = _.isString

// timeInLoop('isString({})', 1e7, () => isString({}))

// timeInLoop('_.isString({})', 1e7, () => _isString({}))

// timeInLoop('isString([])', 1e7, () => isString([]))

// timeInLoop('_.isString([])', 1e7, () => _isString([]))

// timeInLoop('isString(\'hey\')', 1e7, () => isString('hey'))

// timeInLoop('_.isString(\'hey\')', 1e7, () => _isString('hey'))

// timeInLoop('isString(null)', 1e7, () => isString(null))

// timeInLoop('_.isString(null)', 1e7, () => _isString(null))
